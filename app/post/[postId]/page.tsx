"use client";

import {
  Layout,
  LegacyCard,
  LegacyStack,
  Page,
  Spinner,
} from "@shopify/polaris";
import Navigation from "@/components/Navigation/Navigation";
import { useEffect, useState } from "react";
import { useUserContext } from "@/components/hooks/userContext";
import HomePageSkeleton from "@/components/skeletons/HomePageSkeleton";
import { BigPostEntity } from "@/lib/entities/Post";
import { loadPostForUser } from "@/app/posts";
import PostAlone from "@/components/Post/PostAlone";
import TopBarPost from "@/components/TopBar/TopBarPost";
import Comments from "@/components/Post/Comments";

interface Params {
  params: {
    postId: string;
  };
}

export default function PostPage({ params }: Params) {
  const { user, loaded } = useUserContext();
  const [post, setPost] = useState<BigPostEntity>();
  const [fetchingPost, setFetchingPost] = useState(false);

  const fetchPost = async () => {
    setFetchingPost(true);
    const data = await loadPostForUser(params.postId, user.id);
    setPost(data);
    setFetchingPost(false);
  };

  useEffect(() => {
    if (loaded) {
      fetchPost();
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
                {fetchingPost && (
                  <LegacyCard>
                    <LegacyStack alignment="center" distribution="center">
                      <Spinner />
                    </LegacyStack>
                  </LegacyCard>
                )}
                {!fetchingPost && post && (
                  <PostAlone post={post} currentUserId={user.id} />
                )}
              </div>
            </Layout.Section>
            {post && <Comments postId={post.id} currentUserId={user.id} />}
          </Layout>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
