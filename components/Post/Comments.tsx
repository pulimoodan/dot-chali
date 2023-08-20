"use client";

import {
  ActionList,
  Avatar,
  Button,
  Layout,
  LegacyCard,
  LegacyStack,
  Popover,
  Spinner,
  Text,
  TextField,
} from "@shopify/polaris";
import {
  SendMajor,
  MobileVerticalDotsMajor,
  DeleteMinor,
} from "@shopify/polaris-icons";
import { useEffect, useState } from "react";
import { BigPostEntity } from "@/lib/entities/Post";
import { commentPost, deleteComment, loadCommentsForPost } from "@/app/posts";
import CommentEntity from "@/lib/entities/Comment";
import { convertTimeToSince } from "@/lib/general";

interface Props {
  postId: string;
  currentUserId: string;
}

function Comments({ postId, currentUserId }: Props) {
  const [fetchingComments, setFetchingComments] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [comments, setComments] = useState<CommentEntity[]>([]);
  const [newComment, setNewComment] = useState("");
  const [moreActions, setMoreActions] = useState("");

  const fetchComments = async () => {
    setFetchingComments(true);
    const data = await loadCommentsForPost(postId);
    setComments(data);
    setFetchingComments(false);
  };

  const handlePostComment = async () => {
    setCommenting(true);
    const data = await commentPost(postId, currentUserId, newComment);
    setComments([data, ...comments]);
    setNewComment("");
    setCommenting(false);
  };

  const handleDelete = async (commentId: string) => {
    setDeleting(true);
    await deleteComment(commentId);
    setComments((state) => state.filter((item) => item.id != commentId));
    setMoreActions("");
    setDeleting(false);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <>
      <Layout.Section>
        <LegacyStack distribution="equalSpacing">
          <Text as="h2">Comments</Text>
          <Text as="p" color="subdued" variant="bodySm">
            {comments.length.toString()}
          </Text>
        </LegacyStack>
      </Layout.Section>
      <Layout.Section>
        <TextField
          autoComplete="off"
          label
          placeholder="Awesome!"
          value={newComment}
          onChange={(value) => setNewComment(value)}
          connectedRight={
            <Button
              primary
              icon={SendMajor}
              loading={commenting}
              onClick={handlePostComment}
            />
          }
        />
      </Layout.Section>
      <Layout.Section>
        <LegacyCard>
          {fetchingComments && (
            <LegacyCard.Section>
              <LegacyStack alignment="center" distribution="center">
                <Spinner size="small" />
              </LegacyStack>
            </LegacyCard.Section>
          )}
          {!fetchingComments && comments.length == 0 && (
            <LegacyCard sectioned>
              <Text alignment="center" color="subdued" as="p">
                No comments yet.
              </Text>
            </LegacyCard>
          )}
          {comments.map((comment) => (
            <LegacyCard.Section>
              <LegacyStack distribution="equalSpacing">
                <LegacyStack>
                  <Avatar
                    source={comment.user.profilePic || ""}
                    size="extraSmall"
                  />
                  <LegacyStack vertical spacing="extraTight">
                    <Text as="p" variant="bodySm" color="subdued">
                      {comment.user.firstName} {comment.user.lastName} &#x2022;
                      @{comment.user.userName} &#x2022;{" "}
                      {convertTimeToSince(comment.createdAt)}
                    </Text>
                    <Text as="p" variant="bodySm">
                      {comment.content}
                    </Text>
                  </LegacyStack>
                </LegacyStack>
                {comment.user.id == currentUserId && (
                  <Popover
                    active={moreActions == comment.id}
                    onClose={() => setMoreActions("")}
                    activator={
                      <Button
                        size="large"
                        plain
                        icon={MobileVerticalDotsMajor}
                        onClick={() => {
                          if (moreActions) setMoreActions("");
                          else setMoreActions(comment.id);
                        }}
                      />
                    }
                  >
                    <ActionList
                      items={[
                        {
                          content: "Delete",
                          icon: DeleteMinor,
                          onAction: () => handleDelete(comment.id),
                          disabled: deleting,
                        },
                      ]}
                    />
                  </Popover>
                )}
              </LegacyStack>
            </LegacyCard.Section>
          ))}
        </LegacyCard>
      </Layout.Section>
    </>
  );
}

export default Comments;
