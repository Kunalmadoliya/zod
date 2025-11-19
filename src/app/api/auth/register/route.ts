import dbConnect from "@/lib/dbConnect";
import SendEmail from "@/lib/SendEmail";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const {username, email, password} = await req.json();

    // Validate
    if (!username || !email || !password) {
      return Response.json(
        {success: false, message: "All fields are required"},
        {status: 400}
      );
    }

    // Check username conflict (only if verified)
    const existingUsername = await User.findOne({username, isVerified: true});
    if (existingUsername) {
      return Response.json(
        {success: false, message: "Username is already taken"},
        {status: 400}
      );
    }

    // Check email
    const existingEmail = await User.findOne({email});

    // Hash password once
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const expiryDate = new Date(Date.now() + 3600000); // 1 hour

    // CASE 1 — Email exists but user is NOT verified → update user
    if (existingEmail && !existingEmail.isVerified) {
      existingEmail.username = username;
      existingEmail.password = hashedPassword;
      existingEmail.verificationCode = verificationCode;
      existingEmail.verificationCodeExpire = expiryDate;
      await existingEmail.save();
    }

    // CASE 2 — Fresh new user
    if (!existingEmail) {
      await User.create({
        username,
        email,
        password: hashedPassword,
        verificationCode,
        verificationCodeExpire: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
    }

    // Send verification email
    const sendEmailRes = await SendEmail(email, username, verificationCode);
    if (!sendEmailRes.success) {
      return Response.json(
        {success: false, message: sendEmailRes.message},
        {status: 500}
      );
    }

    return Response.json(
      {
        success: true,
        message: "OTP sent. Please verify your email.",
      },
      {status: 201}
    );
  } catch (err) {
    console.error("Register error:", err);
    return Response.json(
      {success: false, message: "Server error"},
      {status: 500}
    );
  }
}
