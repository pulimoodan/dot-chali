"use server";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import { sendOtpToUserId } from "../verify/verify";
import { redirect } from "next/navigation";

export interface SignUpEntity {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export async function createUser({
  email,
  firstName,
  lastName,
  password,
}: SignUpEntity) {
  // step 1 // check if email is already registered
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) return { error: "Email already registered" };

  // step 2 // hashing password
  password = await bcrypt.hash(password, 10);

  // step 3 // generate username
  let finding = true;
  let userName = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
  while (finding) {
    const user = await prisma.user.findUnique({ where: { userName } });
    if (!user) finding = false;
    else userName += Math.floor(Math.random() * 10);
  }

  // step 4 // generate otp
  const otp = Math.floor(100000 + Math.random() * 900000);

  // stpe 5 // create user
  const createdUser = await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      password,
      userName,
      otp: {
        create: {
          otp,
        },
      },
    },
    select: {
      id: true,
      email: true,
      userName: true,
    },
  });

  // step 6 // send otp to the user email
  await sendOtpToUserId(createdUser.id);

  redirect(`/verify/${createdUser.id}`);
}
