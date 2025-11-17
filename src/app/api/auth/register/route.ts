import dbConnect from "@/lib/dbConnect";
import SendEmail from "@/lib/SendEmail";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function register(req: Request) {
  await dbConnect();
  try {
    const {username, email, password} = await req.json();

    const verifiedUserByUsername = await User.findOne({
      username,
      isVerified: true,
    });

    const verifiedUserByEmail = await User.findOne({email});

    if (verifiedUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        {status: 400}
      );
    }

    if (verifiedUserByEmail && verifiedUserByEmail.isVerified === true) {
      return Response.json(
        {
          success: false,
          message: "Email is already taken",
        },
        {status: 400}
      );
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    if (verifiedUserByEmail && !verifiedUserByEmail.isVerified) {
      verifiedUserByEmail!.password = hashedPassword;
      verifiedUserByEmail!.verificationCode = verificationCode;

      verifiedUserByEmail.verificationCodeExpire = new Date(
        Date.now() + 3600000
      );

      await verifiedUserByEmail.save();
    }

    if (!verifiedUserByEmail) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        verificationCode: verificationCode,
        verificationCodeExpire: expiryDate,
        isVerified: true,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    const sendUserEmail = await SendEmail(email, username, verificationCode);
    if (!sendUserEmail.success) {
      return Response.json(
        {
          success: false,
          message: sendUserEmail.message,
        },
        {status: 500}
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your account.",
      },
      {status: 201}
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {status: 500}
    );
  }
}
