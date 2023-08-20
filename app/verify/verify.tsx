"use server";
import prisma from "@/lib/db";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface EmailArgs {
  to: string;
  subject: string;
  text: string;
}

// Create a transporter object
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function sendEmail({ to, subject, text }: EmailArgs) {
  // Define the email options
  const mailOptions = {
    from: "dotrpmsince2023@gmail.com",
    to,
    subject,
    text,
  };
  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

export async function resendOtpToUserId(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { otp: true },
  });
  if (!user) return { error: "User not found" };
  if (!user.otp) return { error: "OTP not generated" };
  const seconds = (new Date().getTime() - user.otp.updatedAt.getTime()) / 1000;
  if (seconds > 60) return { error: "Email already sent" };
  const otp = Math.floor(100000 + Math.random() * 900000);
  await sendEmail({
    to: user.email,
    subject: "OTP verification for Chali",
    text: `${otp} is your OTP for verifying new accout for Chali.`,
  });
  await prisma.oTP.update({
    where: { id: user.otp.id },
    data: { otp },
  });
}

export async function sendOtpToUserId(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { otp: true },
  });
  if (!user) return { error: "User not found" };
  if (!user.otp) return { error: "OTP not generated" };
  await sendEmail({
    to: user.email,
    subject: "OTP verification for Chali",
    text: `${user.otp.otp} is your OTP for verifying new accout for Chali.`,
  });
}

export async function verifyOtpByUserId(userId: string, otp: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { otp: true },
  });
  if (!user) return { error: "User not found" };
  if (user.otp?.otp == otp) {
    await prisma.oTP.delete({ where: { id: user.otp.id } });
    const token = await generateJwtToken(user.id);
    cookies().set({
      name: "session_token",
      value: token,
      httpOnly: true,
    });
    redirect("/");
  } else {
    throw Error("Incorrect OTP");
  }
}

export async function generateJwtToken(userId: string) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET || "AbCde");
  return token;
}
