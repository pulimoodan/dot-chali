"use server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

export async function loadUserFromToken() {
  // step 1 // load token from cookies
  const token = cookies().get("session_token");
  if (!token) return { error: "Not signed in" };

  // step 2 // verify the token
  const verified = jwt.verify(token.value, process.env.JWT_SECRET || "AbCde");
  if (!verified || typeof verified == "string")
    return { error: "Invalid token" };

  // step 3 // load the user
  const user = await prisma.user.findUnique({
    where: { id: verified.userId },
    select: {
      userName: true,
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      profilePic: true,
      otp: true,
    },
  });

  if (user?.otp) {
    redirect(`/verify/${user.id}`);
  }

  if (!user) return { error: "User not found" };
  return user;
}

export async function logoutUser() {
  const token = cookies().get("session_token");
  if (!token) return { error: "Not signed in" };
  cookies().delete(token);
  redirect("/login");
}

export async function followUser(creatorId: string, userId: string) {
  const follow = await prisma.follow.create({
    data: {
      creator: {
        connect: {
          id: creatorId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
  return follow;
}

export async function unFollowUser(creatorId: string, userId: string) {
  await prisma.follow.delete({
    where: {
      userId_creatorId: {
        creatorId,
        userId,
      },
    },
  });
  return { success: true };
}
