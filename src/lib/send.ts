import type {NextApiRequest, NextApiResponse} from "next";

import {Resend} from "resend";
import {EmailTemplate} from "../../email/EmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export default EmailSend = async(req: NextApiRequest, res: NextApiResponse) => {
  const {data, error} = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: ["delivered@resend.dev"],
    subject: "Hello world",
    react: EmailTemplate({username , otp}),
  });

  if (error) {
    return res.status(400).json(error);
  }

  res.status(200).json(data);
};
