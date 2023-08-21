"use client";

import {
  Autocomplete,
  Avatar,
  Badge,
  Button,
  Icon,
  Layout,
  LegacyCard,
  LegacyStack,
  Page,
  SkeletonThumbnail,
  Spinner,
  Tag,
  Text,
  TextField,
  Thumbnail,
} from "@shopify/polaris";

import {
  HashtagMinor,
  SearchMinor,
  MentionMajor,
  EditMinor,
  CameraMajor,
} from "@shopify/polaris-icons";
import Navigation from "@/components/Navigation/Navigation";
import { useCallback, useEffect, useState, useRef, ChangeEvent } from "react";
import { useUserContext } from "@/components/hooks/userContext";
import HomePageSkeleton from "@/components/skeletons/HomePageSkeleton";
import { createPost, loadPostsOfUser, loadTags } from "@/app/posts";
import TopBarPost from "@/components/TopBar/TopBarPost";
import { TagEntity } from "@/lib/entities/Tag";
import { Status } from "@shopify/polaris/build/ts/src/components/Badge";
import { useUIContext } from "@/components/hooks/uiContext";
import styles from "./profile.module.css";
import { loadUserStats, saveUserDetails, uploadProfilePic } from "../user";
import { ProfileStats } from "@/lib/entities/ProfileStats";
import UserEditModal from "@/components/User/UserEditModal";
import { BigPostEntity } from "@/lib/entities/Post";
import Post from "@/components/Post/Post";

export default function CreatePage() {
  const { user, loaded } = useUserContext();
  const { toast } = useUIContext();
  const fileInput = useRef<HTMLInputElement>(null);
  const [fetchingStats, setFetchingStats] = useState(false);
  const [fetchingPosts, setFetchingPosts] = useState(false);
  const [posts, setPosts] = useState<BigPostEntity[]>([]);
  const [uploading, setUploading] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [stats, setStats] = useState<ProfileStats>({
    posts: 0,
    followers: 0,
    popularity: 0,
  });

  const handleSaveUserDetails = async (
    userName: string,
    firstName: string,
    lastName: string
  ) => {
    const details = await saveUserDetails(
      userName,
      firstName,
      lastName,
      user.id
    );
    setFirstName(details.firstName);
    setLastName(details.lastName);
    setUserName(details.userName);
    return true;
  };

  const fetchUserStats = async () => {
    setFetchingStats(true);
    const data = await loadUserStats(user.id);
    setStats(data);
    setFetchingStats(false);
  };

  const fetchUserPosts = async () => {
    setFetchingPosts(true);
    const data = await loadPostsOfUser(user.id);
    setPosts(data);
    setFetchingPosts(false);
  };

  const handleChooseFile = () => {
    if (fileInput.current) fileInput.current.click();
  };

  const handleFileUpload = async () => {
    setUploading(true);
    const file = fileInput.current?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const fileData = reader?.result?.toString().split(",")[1];
      if (fileData) {
        const url = await uploadProfilePic(fileData, user.id);
        setProfilePic(url || "");
        toast.show("Uploaded");
        setUploading(false);
      }
    };
  };

  useEffect(() => {
    if (loaded) {
      fetchUserStats();
      fetchUserPosts();
      setProfilePic(user.profilePic || "");
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setUserName(user.userName);
    }
  }, [loaded]);

  if (!loaded) return <HomePageSkeleton />;

  return (
    <Page>
      <Layout>
        <TopBarPost />
        <Navigation user={user} />
        <Layout.Section>
          <Layout>
            <Layout.Section>
              <div style={{ marginTop: "3.5rem" }}>
                <LegacyCard>
                  <LegacyCard.Section>
                    <LegacyStack distribution="equalSpacing">
                      <LegacyStack alignment="center">
                        {uploading ? (
                          <Spinner size="large" />
                        ) : (
                          <div className={styles.image}>
                            {profilePic ? (
                              <Thumbnail
                                size="large"
                                source={profilePic}
                                alt="Profile picture"
                              />
                            ) : (
                              <SkeletonThumbnail size="large" />
                            )}
                            <div className={styles.upload}>
                              <input
                                ref={fileInput}
                                onInput={handleFileUpload}
                                type="file"
                                style={{ display: "none" }}
                                accept="image/png, image/gif, image/jpeg"
                              />
                              <Button
                                size="micro"
                                icon={CameraMajor}
                                onClick={handleChooseFile}
                              ></Button>
                            </div>
                          </div>
                        )}
                        <LegacyStack vertical spacing="tight">
                          <Text as="h1" variant="headingMd">
                            {firstName} {lastName}
                          </Text>
                          <Badge
                            status="attention"
                            icon={MentionMajor}
                            size="large-experimental"
                          >
                            {userName}
                          </Badge>
                          <Text as="p" color="subdued">
                            {user.email}
                          </Text>
                        </LegacyStack>
                      </LegacyStack>
                      <Button
                        icon={EditMinor}
                        primary
                        onClick={() => setEditModal(true)}
                      >
                        Edit
                      </Button>
                    </LegacyStack>
                  </LegacyCard.Section>
                  <LegacyCard.Section>
                    {fetchingStats ? (
                      <LegacyStack alignment="center" distribution="center">
                        <Spinner />
                      </LegacyStack>
                    ) : (
                      <LegacyStack alignment="center" distribution="fillEvenly">
                        <LegacyStack
                          vertical
                          alignment="center"
                          spacing="extraTight"
                        >
                          <Text as="h3" variant="headingXl" color="success">
                            {stats.posts.toString()}
                          </Text>
                          <Text as="h4" variant="bodyMd" color="subdued">
                            Post{stats.posts == 1 ? "" : "s"}
                          </Text>
                        </LegacyStack>
                        <LegacyStack
                          vertical
                          alignment="center"
                          spacing="extraTight"
                        >
                          <Text as="h3" variant="headingXl" color="success">
                            {stats.followers.toString()}
                          </Text>
                          <Text as="h4" variant="bodyMd" color="subdued">
                            Follower{stats.followers == 1 ? "" : "s"}
                          </Text>
                        </LegacyStack>
                        <LegacyStack
                          vertical
                          alignment="center"
                          spacing="extraTight"
                        >
                          <Text as="h3" variant="headingXl" color="success">
                            {stats.popularity.toString()}
                          </Text>
                          <Text as="h4" variant="bodyMd" color="subdued">
                            Popularity
                          </Text>
                        </LegacyStack>
                      </LegacyStack>
                    )}
                  </LegacyCard.Section>
                </LegacyCard>
              </div>
            </Layout.Section>
            <Layout.Section>
              <Text as="h2" variant="headingMd">
                Posts
              </Text>
            </Layout.Section>
            <Layout.Section>
              {fetchingPosts && (
                <LegacyCard sectioned>
                  <LegacyStack alignment="center" distribution="center">
                    <Spinner />
                  </LegacyStack>
                </LegacyCard>
              )}
              {!fetchingPosts &&
                posts?.map((post) => (
                  <Post post={post} currentUserId={user.id} />
                ))}
            </Layout.Section>
          </Layout>
        </Layout.Section>
      </Layout>
      <UserEditModal
        user={{
          userId: user.id,
          firstName: firstName,
          lastName: lastName,
          userName: userName,
        }}
        active={editModal}
        close={() => setEditModal(false)}
        save={handleSaveUserDetails}
      />
    </Page>
  );
}
