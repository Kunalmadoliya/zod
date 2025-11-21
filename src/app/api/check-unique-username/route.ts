import UserModel from "@/models/User";
import z from "zod";
import {usernameValidation} from "@/schema/signUpSchema";
import dbConnect from "@/lib/dbConnect";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(req: Request) {
  await dbConnect();
  try {
    const {searchParams} = new URL(req.url);
    const queryParams = {
      username: searchParams.get("username"),
    };

    const result = usernameQuerySchema.safeParse(queryParams);

    console.log(result);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
        },
        {status: 400}
      );
    }

    const {username} = result.data;

    const user = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (!user) {
      return Response.json(
        {
          success: true,
          message: "Username is unique",
        },
        {status: 200}
      );
    }

    return Response.json(
      {
        success: false,
        message: "Username is already taken",
      },
      {status: 200}
    );
  } catch (error) {
    console.error("Error checking username:", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      {status: 500}
    );
  }
}
