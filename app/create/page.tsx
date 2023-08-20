"use client";

import {
  Autocomplete,
  Badge,
  Button,
  Icon,
  Layout,
  LegacyCard,
  LegacyStack,
  Page,
  Tag,
  Text,
  TextField,
} from "@shopify/polaris";

import { HashtagMinor, SearchMinor } from "@shopify/polaris-icons";
import Navigation from "@/components/Navigation/Navigation";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useUserContext } from "@/components/hooks/userContext";
import HomePageSkeleton from "@/components/skeletons/HomePageSkeleton";
import { createPost, loadTags } from "@/app/posts";
import TopBarPost from "@/components/TopBar/TopBarPost";
import { TagEntity } from "@/lib/entities/Tag";
import { Status } from "@shopify/polaris/build/ts/src/components/Badge";
import { useUIContext } from "@/components/hooks/uiContext";
import { useRouter } from "next/navigation";

export default function CreatePage() {
  const { user, loaded } = useUserContext();
  const { toast } = useUIContext();
  const router = useRouter();

  const [tags, setTags] = useState<TagEntity[]>();
  const [tagOptions, setTagOptions] = useState<TagEntity[]>([]);
  const [content, setContent] = useState("");
  const [creatingPost, setCreatingPost] = useState(false);
  const [fetchingTags, setFetchingTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInputValue, setTagInputValue] = useState("");

  const updateTagSearch = useMemo(
    () => (value: string) => {
      setTagInputValue(value);

      if (value == "") {
        setTagOptions([]);
        return;
      }

      const filterRegex = new RegExp(value, "i");
      const resultOptions =
        tags?.filter((tag) => tag.name.match(filterRegex)) || [];

      setTagOptions(resultOptions);
    },
    [tagInputValue]
  );

  const removeTag = useCallback(
    (tag: string) => () => {
      const options = [...selectedTags];
      options.splice(options.indexOf(tag), 1);
      setSelectedTags(options);
    },
    [selectedTags]
  );

  const fetchTags = async () => {
    setFetchingTags(true);
    const data = await loadTags();
    setTags(data);
    setFetchingTags(false);
  };

  const handleCreatePost = async () => {
    setCreatingPost(true);
    await createPost(content, selectedTags, user.id);
    toast.show("Post created successfully");
    setCreatingPost(false);
    router.push("/");
  };

  useEffect(() => {
    if (loaded) {
      fetchTags();
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
                    <TextField
                      type="text"
                      multiline
                      showCharacterCount
                      maxLength={500}
                      maxHeight={200}
                      autoComplete="off"
                      label="Content"
                      value={content}
                      onChange={(value) => setContent(value)}
                    />
                  </LegacyCard.Section>
                  <LegacyCard.Section>
                    <LegacyStack vertical>
                      <Autocomplete
                        allowMultiple
                        options={tagOptions.map((tag) => {
                          return {
                            label: (
                              <div style={{ width: "100%" }}>
                                <LegacyStack
                                  alignment="center"
                                  distribution="equalSpacing"
                                >
                                  <Badge
                                    status={tag.color as Status}
                                    icon={HashtagMinor}
                                    size="small"
                                  >
                                    {tag.name}
                                  </Badge>
                                  <Text as="p" color="subdued">
                                    {tag.followers.toString()} Follower
                                    {tag.followers == 1
                                      ? ""
                                      : "s"} &#x2022; {tag.posts.toString()}{" "}
                                    Post
                                    {tag.posts == 1 ? "" : "s"}
                                  </Text>
                                </LegacyStack>
                              </div>
                            ),
                            value: tag.id,
                          };
                        })}
                        selected={selectedTags}
                        onSelect={setSelectedTags}
                        textField={
                          <Autocomplete.TextField
                            disabled={fetchingTags || selectedTags.length == 4}
                            label="Select tags"
                            type="search"
                            autoComplete="off"
                            value={tagInputValue}
                            prefix={<Icon source={SearchMinor} color="base" />}
                            onChange={updateTagSearch}
                            helpText="Maximum 4 tags allowed."
                          />
                        }
                      />
                      <LegacyStack alignment="center">
                        {selectedTags.map((tag) => (
                          <Tag onRemove={removeTag(tag)}>
                            {tags?.find((t) => t.id == tag)?.name}
                          </Tag>
                        ))}
                      </LegacyStack>
                    </LegacyStack>
                  </LegacyCard.Section>
                </LegacyCard>
              </div>
            </Layout.Section>
            <Layout.Section>
              <LegacyStack distribution="leading">
                <Button
                  onClick={() => {
                    setContent("");
                    setSelectedTags([]);
                    setTagInputValue("");
                  }}
                >
                  Clear
                </Button>
                <LegacyStack.Item fill>
                  <Button
                    fullWidth
                    primary
                    loading={creatingPost}
                    onClick={handleCreatePost}
                  >
                    Create
                  </Button>
                </LegacyStack.Item>
              </LegacyStack>
            </Layout.Section>
          </Layout>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
