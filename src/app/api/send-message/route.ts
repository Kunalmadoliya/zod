import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import {Message} from "@/models/User";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const {username, content} = await req.json();

    if (!username) {
      return (
        Response.json({error: "Missing username"}),
        {
          status: 400,
          headers: {"Content-Type": "application/json"},
        }
      );
    }

    const user = await UserModel.findOne({username}).exec();

    if (!user?.isAcceptingMessage) {
      return (
        Response.json({error: "User is not accepting messages"}),
        {
          status: 403,
          headers: {"Content-Type": "application/json"},
        }
      );
    }

    const newMessage = {content, createdAt: new Date()};

    user.messages.push(newMessage as Message);

    await user.save();

    return Response.json(
      {message: "Message sent successfully", success: true},
      {status: 201}
    );
  } catch (error) {
    console.error("Error adding message:", error);
    return Response.json(
      {message: "Internal server error", success: false},
      {status: 500}
    );
  }
}
