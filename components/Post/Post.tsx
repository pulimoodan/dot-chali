import { BigPostEntity } from "@/lib/entities/Post";
import {
  convertTimeToSince,
  copyToClipboard,
  shortenContent,
} from "@/lib/general";
import {
  ActionList,
  Avatar,
  Badge,
  Button,
  ButtonGroup,
  LegacyCard,
  LegacyStack,
  Link,
  Popover,
  ProgressBar,
  Text,
} from "@shopify/polaris";
import {
  ConversationMinor,
  StarOutlineMinor,
  StarFilledMinor,
  MobileVerticalDotsMajor,
  ArrowDownMinor,
  HashtagMinor,
  SmileyJoyMajor,
  SmileyNeutralMajor,
  SmileySadMajor,
  SmileyHappyMajor,
  ShareIosMinor,
  ClipboardMinor,
  ArrowUpMinor,
} from "@shopify/polaris-icons";
import { useState } from "react";
import { Status } from "@shopify/polaris/build/ts/src/components/Badge";
import { likePost, unLikePost, unVotePost, votePost } from "@/app/posts";
import { VoteType } from "@prisma/client";
import { followUser, unFollowUser } from "@/app/user";
import { useUIContext } from "../hooks/uiContext";

interface Props {
  post: BigPostEntity;
  currentUserId: string;
}

const votePoints = {
  great: 2,
  good: 1,
  ok: 0,
  bad: -1,
};

function Post({ post, currentUserId }: Props) {
  const { toast } = useUIContext();

  const [data, setData] = useState<BigPostEntity>(post);
  const [moreActions, setMoreActions] = useState(false);
  const [liking, setLiking] = useState(false);
  const [voting, setVoting] = useState("");
  const [following, setFollowing] = useState(false);
  const [readMore, setReadMore] = useState(false);

  const maxLines = 7;

  const handleLikePost = async () => {
    setLiking(true);
    try {
      await likePost(currentUserId, post.id);
      setData({ ...data, liked: true });
    } catch (_e) {}
    setLiking(false);
  };

  const handleUnLikePost = async () => {
    setLiking(true);
    try {
      await unLikePost(currentUserId, post.id);
      setData({ ...data, liked: false });
    } catch (_e) {}
    setLiking(false);
  };

  const handleVotePost = async (vote: VoteType) => {
    setVoting(vote);
    const tempData = data;

    // resetting values if already votted
    if (tempData.voted) {
      tempData.popularity =
        Number(tempData.popularity) - votePoints[tempData.voted]; // resetting popularity
      tempData.votes = Number(tempData.votes) - 1; // resetting votes
    }

    // unvote or update vote
    const unVoting = vote == data.voted;
    if (unVoting) await unVotePost(currentUserId, post.id);
    else await votePost(currentUserId, post.id, vote);

    // update the data regarding the vote
    setData({
      ...tempData,
      voted: unVoting ? undefined : vote,
      votes: unVoting ? tempData.votes : Number(tempData.votes) + 1,
      popularity: unVoting
        ? tempData.popularity
        : Number(tempData.popularity) + votePoints[vote],
    });

    setVoting("");
  };

  const handleFollow = async () => {
    setFollowing(true);
    await followUser(post.user.id, currentUserId);
    setData({ ...data, user: { ...data.user, following: true } });
    setFollowing(false);
  };

  const handleUnFollow = async () => {
    setFollowing(true);
    await unFollowUser(post.user.id, currentUserId);
    setData({ ...data, user: { ...data.user, following: false } });
    setFollowing(false);
  };

  const handleShare = () => {
    copyToClipboard(`/post/${data.id}`);
    setMoreActions(false);
    toast.show("Link copied to clipboard");
  };

  const handleCopyContent = () => {
    copyToClipboard(data.content);
    setMoreActions(false);
    toast.show("Content copied to clipboard");
  };

  return (
    <LegacyCard>
      <LegacyCard.Section>
        <LegacyStack alignment="center" distribution="equalSpacing">
          <LegacyStack alignment="center">
            <Avatar customer size="medium" />
            <LegacyStack vertical spacing="extraTight">
              <Text as="h4" variant="headingSm">
                {data.user.firstName} {data.user.lastName} &#x2022;{" "}
                <Button
                  plain
                  loading={following}
                  size="micro"
                  onClick={data.user.following ? handleUnFollow : handleFollow}
                >
                  {data.user.following ? "Following" : "Follow"}
                </Button>
              </Text>
              <Text as="p" variant="bodySm">
                @{data.user.userName} &#x2022;{" "}
                {convertTimeToSince(data.createdAt)}
              </Text>
            </LegacyStack>
          </LegacyStack>

          <LegacyStack alignment="center">
            <Button
              size="slim"
              icon={ConversationMinor}
              url={`/post/${data.id}`}
            >
              {data.comments.toString()} Comment{data.comments > 1 ? "s" : ""}
            </Button>
            <Button
              size="slim"
              onClick={data.liked ? handleUnLikePost : handleLikePost}
              primary={data.liked}
              loading={liking}
              icon={data.liked ? StarFilledMinor : StarOutlineMinor}
            />
            <Popover
              active={moreActions}
              onClose={() => setMoreActions(false)}
              activator={
                <Button
                  size="large"
                  plain
                  icon={MobileVerticalDotsMajor}
                  onClick={() => setMoreActions((state) => !state)}
                />
              }
            >
              <ActionList
                items={[
                  {
                    content: "Share",
                    icon: ShareIosMinor,
                    onAction: handleShare,
                  },
                  {
                    content: "Copy",
                    icon: ClipboardMinor,
                    onAction: handleCopyContent,
                  },
                ]}
              />
            </Popover>
          </LegacyStack>
        </LegacyStack>
      </LegacyCard.Section>
      <LegacyCard.Section subdued>
        <LegacyStack vertical spacing="baseTight">
          <Text as="p">
            <div style={{ whiteSpace: "pre-line" }}>
              {(readMore
                ? data.content
                : shortenContent(data.content, maxLines)
              )
                .split("\\n")
                .map(function (item, idx) {
                  return (
                    <span key={idx}>
                      {item}
                      <br />
                    </span>
                  );
                })}
            </div>
          </Text>
          {data.content.split("\\n").length > maxLines && (
            <Button
              icon={readMore ? ArrowUpMinor : ArrowDownMinor}
              plain
              onClick={() => setReadMore((state) => !state)}
            >
              {readMore ? "Read less" : "Read more"}
            </Button>
          )}
          <LegacyStack alignment="center" spacing="tight">
            {data.tags &&
              data.tags.map((tag) => (
                <Badge status={tag.color as Status} icon={HashtagMinor}>
                  {tag.name}
                </Badge>
              ))}
          </LegacyStack>
        </LegacyStack>
      </LegacyCard.Section>
      <LegacyCard.Section>
        <LegacyStack vertical spacing="baseTight">
          <LegacyStack alignment="center" distribution="equalSpacing">
            <Text as="p" color="subdued">
              {data.popularity?.toString()} Popularity
            </Text>
            <Text as="p" color="subdued">
              {data.votes?.toString()} Vote{data.votes > 1 ? "s" : ""}
            </Text>
          </LegacyStack>
          <ProgressBar
            animated
            progress={
              (Number(data.popularity) / (Number(data.votes) * 2)) * 100
            }
            size="small"
          />
          <ButtonGroup segmented fullWidth>
            <Button
              icon={SmileyJoyMajor}
              primary={data.voted == "great"}
              loading={voting == "great"}
              onClick={() => handleVotePost("great")}
            />
            <Button
              icon={SmileyHappyMajor}
              primary={data.voted == "good"}
              loading={voting == "good"}
              onClick={() => handleVotePost("good")}
            />
            <Button
              icon={SmileyNeutralMajor}
              primary={data.voted == "ok"}
              loading={voting == "ok"}
              onClick={() => handleVotePost("ok")}
            />
            <Button
              icon={SmileySadMajor}
              primary={data.voted == "bad"}
              loading={voting == "bad"}
              onClick={() => handleVotePost("bad")}
            />
          </ButtonGroup>
        </LegacyStack>
      </LegacyCard.Section>
    </LegacyCard>
  );
}

export default Post;
