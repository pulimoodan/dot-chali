"use client";

import Post from "@/components/Post/Post";
import {
  Layout,
  LegacyCard,
  LegacyStack,
  Page,
  Spinner,
  Text,
} from "@shopify/polaris";
import Navigation from "@/components/Navigation/Navigation";
import { useEffect, useState, useRef } from "react";
import { useUserContext } from "@/components/hooks/userContext";
import HomePageSkeleton from "@/components/skeletons/HomePageSkeleton";
import { loadFavouritePostsForUser, loadFollowingPostsForUser } from "../posts";
import { BigPostEntity } from "@/lib/entities/Post";
import TopBarPost from "@/components/TopBar/TopBarPost";

export default function Home() {
  const { user, loaded } = useUserContext();
  const [posts, setPosts] = useState<BigPostEntity[]>([]);
  const [fetchingPosts, setFetchingPosts] = useState(false);
  const [end, setEnd] = useState(false);
  let [page, setPage] = useState(-1);
  const loadElem = useRef<HTMLDivElement>(null);

  const fetchPosts = async () => {
    setFetchingPosts(true);
    const data = await loadFavouritePostsForUser(user.id, page);
    if (data.length == 0) setEnd(true);
    setPosts((state) => [...state, ...data]);
    setFetchingPosts(false);
  };

  useEffect(() => {
    if (page != -1) fetchPosts();
  }, [page]);

  useEffect(() => {
    if (loaded) setPage((state) => ++state);
  }, [loaded]);

  useEffect(() => {
    window.addEventListener("scroll", async () => {
      if (!loadElem.current) return;

      const elemRect = loadElem.current.getBoundingClientRect();
      const viewHeight = Math.max(window.innerHeight);
      const scrolledIntoView = !(
        elemRect.bottom < 0 || elemRect.top - viewHeight >= 0
      );

      if (scrolledIntoView) setPage((state) => ++state);
    });
  }, []);

  if (!loaded) return <HomePageSkeleton />;

  return (
    <Page>
      <Layout>
        <TopBarPost />
        <Navigation user={user} />
        <Layout.Section>
          <div style={{ marginTop: "3.5rem" }}>
            {posts?.map((post) => (
              <Post post={post} currentUserId={user.id} />
            ))}

            {!fetchingPosts && !end && <div ref={loadElem}></div>}

            {fetchingPosts && (
              <LegacyCard sectioned>
                <LegacyStack alignment="center" distribution="center">
                  <Spinner />
                </LegacyStack>
              </LegacyCard>
            )}
            {end && (
              <LegacyCard sectioned>
                <LegacyStack alignment="center" distribution="center">
                  <Text as="p" color="subdued">
                    That's all.
                  </Text>
                </LegacyStack>
              </LegacyCard>
            )}
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
