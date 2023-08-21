"use server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { ProfileStats } from "@/lib/entities/ProfileStats";
import fs from "fs";
import { promisify } from "util";
const writeFileAsync = promisify(fs.writeFile);

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

export async function loadUserStats(currentUserId: string) {
  const rawStats = await prisma.$queryRaw<ProfileStats[]>`
    SELECT 
    (SELECT COUNT(*) FROM "Follow" WHERE "Follow"."creatorId" = "User"."id") AS followers,
    (SELECT COUNT(*) FROM "Post" WHERE "Post"."userId" = "User"."id") AS posts,
    (SELECT
      SUM(CASE WHEN "Vote"."voteType" = 'great' THEN 2 WHEN "Vote"."voteType" = 'good' THEN 1 WHEN "Vote"."voteType" = 'ok' THEN 0 WHEN "Vote"."voteType" = 'bad' THEN -1 END)
      FROM "Vote"
      LEFT JOIN "Post" ON "Post"."userId" = "User"."id"
      WHERE "Vote"."postId" = "Post"."id"
    ) AS popularity
    FROM "User"
    WHERE "User"."id" = ${currentUserId}
  `;
  return rawStats[0];
}

export async function uploadProfilePic(fileData: string, userId: string) {
  const buffer = Buffer.from(fileData, "base64");
  const fileName = `${userId}.jpg`; // Change this to your desired filename
  const filePath = `./public/uploads/${fileName}`; // Adjust the path as needed

  // Write the binary data to the file
  fs.writeFileSync(filePath, buffer);
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      profilePic: `/uploads/${fileName}`,
    },
  });

  return `/uploads/${fileName}`;
}

export async function checkUserName(userName: string) {
  const user = await prisma.user.findUnique({
    where: {
      userName,
    },
  });
  if (user) return false;
  return true;
}

export async function saveUserDetails(
  userName: string,
  firstName: string,
  lastName: string,
  userId: string
) {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      userName,
      firstName,
      lastName,
    },
    select: {
      userName: true,
      firstName: true,
      lastName: true,
    },
  });
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
