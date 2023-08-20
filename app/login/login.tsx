"use server";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import { generateJwtToken } from "../verify/verify";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface LogInEntity {
  email: string;
  password: string;
}

export async function loginUser({ email, password }: LogInEntity) {
  // step 1 // check if the user exists
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw Error("User not found");

  // step 2 // hashing password
  const correctPassword = await bcrypt.compare(password, user.password);
  if (!correctPassword) throw Error("Incorrect password");

  // step 3 // set token
  const token = await generateJwtToken(user.id);
  cookies().set({
    name: "session_token",
    value: token,
  });

  redirect("/");
}
