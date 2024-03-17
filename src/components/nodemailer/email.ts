import type {Transporter} from "nodemailer";

import nodemailer from "nodemailer";

const handleSendEmail = async (subject: string, html: string) => {
  const emailTo = import.meta.env.SMTP_EMAIL;

  if (!emailTo || !import.meta.env.SMTP_PASSWORD) {
    console.error("Missing SMTP_EMAIL or password in .env");
    return;
  }

  const transporter: Transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: import.meta.env.SMTP_EMAIL,
      pass: import.meta.env.SMTP_PASSWORD,
    },
  });

  try {
    await transporter.verify();
  } catch (error) {
    console.error(error);

    return;
  }

  const mailOptions = {
    from: import.meta.env.SMTP_EMAIL,
    to: emailTo,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
  }
};

export default handleSendEmail;