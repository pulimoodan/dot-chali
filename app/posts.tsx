"use server";
import prisma from "@/lib/db";
import { BigPostEntity } from "@/lib/entities/Post";
import { TagEntity } from "@/lib/entities/Tag";
import { VoteType } from "@/lib/entities/Vote";

export async function loadPostsForUser(currentUserId: string) {
  const rawPosts = await prisma.$queryRaw<BigPostEntity[]>`
    SELECT 
    "Post"."id",
    "Post"."content",
    "Post"."createdAt",
    "Post"."updatedAt",
    JSON_AGG(JSON_BUILD_OBJECT('name', "Tag"."name", 'color', "Tag"."color")) FILTER (WHERE "Tag"."name" IS NOT NULL) AS tags,
    JSON_BUILD_OBJECT('id', "User"."id", 'firstName', "User"."firstName", 'lastName', "User"."lastName", 'userName', "User"."userName", 'profilePic', "User"."profilePic", 'following', EXISTS(SELECT * FROM "Follow" JOIN "User" ON "User"."id" = "Follow"."userId" AND "Post"."userId" = "Follow"."creatorId" WHERE "User"."id" = ${currentUserId})) AS user,
    (SELECT COUNT(*) FROM "Vote" WHERE "Vote"."postId" = "Post"."id") AS votes,
    (SELECT
      SUM(CASE WHEN "Vote"."voteType" = 'great' THEN 2 WHEN "Vote"."voteType" = 'good' THEN 1 WHEN "Vote"."voteType" = 'ok' THEN 0 WHEN "Vote"."voteType" = 'bad' THEN -1 END)
      FROM "Vote" WHERE "Vote"."postId" = "Post"."id"
    ) AS popularity,
    (SELECT COUNT(*) FROM "Comment" WHERE "Comment"."postId" = "Post"."id") AS comments,
    (SELECT "Vote"."voteType" FROM "Vote" WHERE "Vote"."postId" = "Post"."id" AND "Vote"."userId" = ${currentUserId}) AS voted,
    EXISTS(SELECT * FROM "Like" JOIN "User" ON "User"."id" = "Like"."userId" AND "Like"."postId" = "Post"."id" WHERE "User"."id" = ${currentUserId}) AS liked
    FROM "Post"
    LEFT JOIN "User" ON "Post"."userId" = "User"."id"
    LEFT JOIN "_PostToTag" ON "Post"."id" = "_PostToTag"."A"
    LEFT JOIN "Tag" ON "Tag"."id" = "_PostToTag"."B"
    GROUP BY "Post"."id", "User"."id"
    ORDER BY "Post"."createdAt" DESC
  `;
  return rawPosts;
}

export async function loadPostsOfUser(currentUserId: string) {
  const rawPosts = await prisma.$queryRaw<BigPostEntity[]>`
    SELECT 
    "Post"."id",
    "Post"."content",
    "Post"."createdAt",
    "Post"."updatedAt",
    JSON_AGG(JSON_BUILD_OBJECT('name', "Tag"."name", 'color', "Tag"."color")) FILTER (WHERE "Tag"."name" IS NOT NULL) AS tags,
    JSON_BUILD_OBJECT('id', "User"."id", 'firstName', "User"."firstName", 'lastName', "User"."lastName", 'userName', "User"."userName", 'profilePic', "User"."profilePic", 'following', EXISTS(SELECT * FROM "Follow" JOIN "User" ON "User"."id" = "Follow"."userId" AND "Post"."userId" = "Follow"."creatorId" WHERE "User"."id" = ${currentUserId})) AS user,
    (SELECT COUNT(*) FROM "Vote" WHERE "Vote"."postId" = "Post"."id") AS votes,
    (SELECT
      SUM(CASE WHEN "Vote"."voteType" = 'great' THEN 2 WHEN "Vote"."voteType" = 'good' THEN 1 WHEN "Vote"."voteType" = 'ok' THEN 0 WHEN "Vote"."voteType" = 'bad' THEN -1 END)
      FROM "Vote" WHERE "Vote"."postId" = "Post"."id"
    ) AS popularity,
    (SELECT COUNT(*) FROM "Comment" WHERE "Comment"."postId" = "Post"."id") AS comments,
    (SELECT "Vote"."voteType" FROM "Vote" WHERE "Vote"."postId" = "Post"."id" AND "Vote"."userId" = ${currentUserId}) AS voted,
    EXISTS(SELECT * FROM "Like" JOIN "User" ON "User"."id" = "Like"."userId" AND "Like"."postId" = "Post"."id" WHERE "User"."id" = ${currentUserId}) AS liked
    FROM "Post"
    LEFT JOIN "User" ON "Post"."userId" = "User"."id"
    LEFT JOIN "_PostToTag" ON "Post"."id" = "_PostToTag"."A"
    LEFT JOIN "Tag" ON "Tag"."id" = "_PostToTag"."B"
    WHERE "Post"."userId" = ${currentUserId}
    GROUP BY "Post"."id", "User"."id"
    ORDER BY "Post"."createdAt" DESC
  `;
  return rawPosts;
}

export async function loadPostForUser(postId: string, currentUserId: string) {
  const rawPosts = await prisma.$queryRaw<BigPostEntity[]>`
    SELECT 
    "Post"."id",
    "Post"."content",
    "Post"."createdAt",
    "Post"."updatedAt",
    JSON_AGG(JSON_BUILD_OBJECT('name', "Tag"."name", 'color', "Tag"."color")) FILTER (WHERE "Tag"."name" IS NOT NULL) AS tags,
    JSON_BUILD_OBJECT('id', "User"."id", 'firstName', "User"."firstName", 'lastName', "User"."lastName", 'userName', "User"."userName", 'profilePic', "User"."profilePic", 'following', EXISTS(SELECT * FROM "Follow" JOIN "User" ON "User"."id" = "Follow"."userId" AND "Post"."userId" = "Follow"."creatorId" WHERE "User"."id" = ${currentUserId})) AS user,
    (SELECT COUNT(*) FROM "Vote" WHERE "Vote"."postId" = "Post"."id") AS votes,
    (SELECT
      SUM(CASE WHEN "Vote"."voteType" = 'great' THEN 2 WHEN "Vote"."voteType" = 'good' THEN 1 WHEN "Vote"."voteType" = 'ok' THEN 0 WHEN "Vote"."voteType" = 'bad' THEN -1 END)
      FROM "Vote" WHERE "Vote"."postId" = "Post"."id"
    ) AS popularity,
    (SELECT COUNT(*) FROM "Comment" WHERE "Comment"."postId" = "Post"."id") AS comments,
    (SELECT "Vote"."voteType" FROM "Vote" WHERE "Vote"."postId" = "Post"."id" AND "Vote"."userId" = ${currentUserId}) AS voted,
    EXISTS(SELECT * FROM "Like" JOIN "User" ON "User"."id" = "Like"."userId" AND "Like"."postId" = "Post"."id" WHERE "User"."id" = ${currentUserId}) AS liked
    FROM "Post"
    LEFT JOIN "User" ON "Post"."userId" = "User"."id"
    LEFT JOIN "_PostToTag" ON "Post"."id" = "_PostToTag"."A"
    LEFT JOIN "Tag" ON "Tag"."id" = "_PostToTag"."B"
    WHERE "Post"."id" = ${postId}
    GROUP BY "Post"."id", "User"."id"
  `;
  return rawPosts[0];
}

export async function loadTags() {
  const rawTags = await prisma.$queryRaw<TagEntity[]>`
    SELECT 
    "Tag"."id",
    "Tag"."name",
    "Tag"."color",
    "Tag"."createdAt",
    "Tag"."updatedAt",
    (SELECT COUNT(*) FROM "Post" JOIN "_PostToTag" ON "_PostToTag"."A" = "Post"."id" AND "Tag"."id" = "_PostToTag"."B") AS posts,
    (SELECT COUNT(*) FROM "User" JOIN "_TagToUser" ON "_TagToUser"."A" = "Tag"."id" AND "User"."id" = "_TagToUser"."B") AS followers
    FROM "Tag"
  `;
  return rawTags;
}

export async function loadCommentsForPost(postId: string) {
  const comments = await prisma.comment.findMany({
    where: {
      postId,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          userName: true,
          profilePic: true,
        },
      },
    },
  });
  return comments;
}

export async function deleteComment(commentId: string) {
  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });
  return { success: true };
}

export async function deletePost(postId: string) {
  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
  return { success: true };
}

export async function commentPost(
  postId: string,
  userId: string,
  content: string
) {
  const comment = await prisma.comment.create({
    data: {
      Post: {
        connect: {
          id: postId,
        },
      },
      content,
      user: {
        connect: {
          id: userId,
        },
      },
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          userName: true,
          profilePic: true,
        },
      },
    },
  });
  return comment;
}

export async function createPost(
  content: string,
  tags: string[],
  userId: string
) {
  await prisma.post.create({
    data: {
      content,
      tags: {
        connect: tags.map((id) => {
          return { id };
        }),
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
  return { success: true };
}

export async function likePost(userId: string, postId: string) {
  const like = await prisma.like.create({
    data: {
      user: {
        connect: {
          id: userId,
        },
      },
      post: {
        connect: {
          id: postId,
        },
      },
    },
  });
  return like;
}

export async function unLikePost(userId: string, postId: string) {
  await prisma.like.deleteMany({ where: { userId, postId } });
  return { success: true };
}

export async function votePost(
  userId: string,
  postId: string,
  voteType: VoteType
) {
  const vote = await prisma.vote.upsert({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
    update: {
      voteType,
    },
    create: {
      voteType,
      user: {
        connect: {
          id: userId,
        },
      },
      post: {
        connect: {
          id: postId,
        },
      },
    },
  });
  return vote;
}

export async function unVotePost(userId: string, postId: string) {
  await prisma.vote.delete({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });
  return { sucess: true };
}
