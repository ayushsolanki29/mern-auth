import { mailTrapClient, sender_Data } from "./config.js";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_TEMPLATE,
} from "./templates.js";

export const sendVerificationEmail = async (email, token) => {
  const recipient = [{ email }];
  try {
    const response = await mailTrapClient.send({
      from: sender_Data,
      to: recipient,
      subject: "Verify Your Email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", token),
      category: "Email Verification",
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.error("Error sending verification email", error);
    throw new Error(`Error sending verification email` + error.message);
  }
};
export const sendResetPasswordEmail = async (email, token) => {
  const recipient = [{ email }];
  try {
    const response = await mailTrapClient.send({
      from: sender_Data,
      to: recipient,
      subject: "Reset Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", token),
      category: "Reset Password",
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.error("Error sending verification email", error);
    throw new Error(`Error sending verification email` + error.message);
  }
};
export const sendResetPasswordSuccessEmail = async (email) => {
  const recipient = [{ email }];
  try {
    const response = await mailTrapClient.send({
      from: sender_Data,
      to: recipient,
      subject: "Password Changed Successfully",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Change",
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.error("Error sending verification email", error);
    throw new Error(`Error sending verification email` + error.message);
  }
};
export const sendWelcomeEmail = async (email, username) => {
  const recipient = [{ email }];
  try {
    const response = await mailTrapClient.send({
      from: sender_Data,
      to: recipient,
      subject: "welcome to our company",
      html: WELCOME_TEMPLATE.replace("{username}", username),
      category: "welcome",
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.error("Error sending verification email", error);
    throw new Error(`Error sending verification email` + error.message);
  }
};
