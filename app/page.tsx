"use client";

import Post from "@/components/Post/Post";
import { Layout, Page, Spinner } from "@shopify/polaris";
import Navigation from "@/components/Navigation/Navigation";
import TopBar from "@/components/TopBar/TopBar";
import { useEffect, useContext, useState } from "react";
import { UserContext } from "@/components/hooks/userContext";
import HomePageSkeleton from "@/components/skeletons/HomePageSkeleton";
import { loadPostsForUser } from "./posts";
import { BigPostEntity } from "@/lib/entities/Post";

export default function Home() {
  const { user, loaded } = useContext(UserContext);
  const [posts, setPosts] = useState<BigPostEntity[]>();
  const [fetchingPosts, setFetchingPosts] = useState(false);

  const fetchPosts = async () => {
    setFetchingPosts(true);
    const data = await loadPostsForUser(user.id);
    setPosts(data);
    console.log(posts);
    setFetchingPosts(false);
  };

  useEffect(() => {
    if (loaded) fetchPosts();
  }, [loaded]);

  if (!loaded) return <HomePageSkeleton />;

  return (
    <Page>
      <Layout>
        <TopBar />
        <Navigation user={user} />
        <Layout.Section>
          <div style={{ marginTop: "3.5rem" }}>
            {fetchingPosts && <Spinner />}
            {posts?.map((post) => (
              <Post post={post} currentUserId={user.id} />
            ))}
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
