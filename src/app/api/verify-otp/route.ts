import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username, code } = await req.json();
    console.log("code:", code);
    console.log("username:", username);

    if (!username || !code) {
      return Response.json(
        { success: false, message: "Missing username or code" },
        { status: 400 }
      );
    }

    const decodedUsername = decodeURIComponent(username);
    console.log("decoded:", decodedUsername);

    const user = await UserModel.findOne({ username: decodedUsername });
    console.log("user:", user);

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 400 }
      );
    }

    const checkOtp = user.verificationCode === code;
    const notExpired = new Date(user.verificationCodeExpire) > new Date();

    if (checkOtp && notExpired) {
      await UserModel.findOneAndUpdate(
        { username: decodedUsername },
        { isVerified: true }
      );

      return Response.json(
        { success: true, message: "Account verified successfully" },
        { status: 200 }
      );
    }

    // ❗ REQUIRED FALLBACK RETURN (YOU WERE MISSING THIS)
    return Response.json(
      { success: false, message: "Invalid or expired OTP" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error verifying user:", error);
    return Response.json(
      { success: false, message: "Error verifying user" },
      { status: 500 }
    );
  }
}
