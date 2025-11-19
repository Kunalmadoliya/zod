
import {Resend} from "resend";
import {EmailTemplate} from "../../emails/EmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function SendEmail(
  email: string,
  username: string,
  verificationCode: string
) {
  try {
    const {data, error} = await resend.emails.send({
      from: "madoliyakunal2005@gmail.com",
      to: email,
      subject: "Verification Code",
      react: EmailTemplate({username, otp: verificationCode}),
    });

    if (error) {
      return {
        success: false,
        message: "Failed to send email",
        error,
      };
    }

    return {
      success: true,
      message: "Email sent successfully",
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
      error: error,
    };
  }
}
