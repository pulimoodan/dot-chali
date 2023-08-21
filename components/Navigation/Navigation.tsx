import { logoutUser } from "@/app/user";
import {
  ActionList,
  Avatar,
  Badge,
  Button,
  Card,
  FooterHelp,
  Layout,
  LegacyCard,
  LegacyStack,
  Link,
  Popover,
  Spinner,
  Text,
} from "@shopify/polaris";
import {
  HomeMinor,
  StarOutlineMinor,
  ConversationMinor,
  NotificationMajor,
  ComposeMajor,
  SettingsMinor,
  SearchMinor,
  MentionMajor,
  MobileVerticalDotsMajor,
  LogOutMinor,
  PopularMajor,
} from "@shopify/polaris-icons";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

interface Props {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    id: string;
    profilePic: string | null;
  };
}

function Navigation({ user }: Props) {
  const pathname = usePathname();
  const [width, setWidth] = useState(0);
  const [moreActions, setMoreActions] = useState(false);
  const elem = useRef(null);

  const calculateWidth = () => {
    const elemWidth = elem.current?.["offsetWidth"] || 0;
    setWidth(elemWidth);
  };

  const handleLogout = async () => {
    await logoutUser();
  };

  useEffect(() => {
    window.addEventListener("resize", function (e) {
      calculateWidth();
    });
    calculateWidth();
  }, []);

  return (
    <Layout.Section secondary>
      <div
        style={{
          marginTop: "3.5rem",
          width: "100%",
        }}
        ref={elem}
      >
        <div
          style={{
            position: width ? "fixed" : "relative",
            width: width ? width : "auto",
          }}
        >
          <Layout>
            <Layout.Section>
              <LegacyCard>
                <ActionList
                  actionRole="menuitem"
                  items={[
                    {
                      active: pathname == "/",
                      content: "Home",
                      icon: HomeMinor,
                      url: "/",
                    },
                    {
                      active: pathname == "/trending",
                      content: "Trending",
                      icon: PopularMajor,
                      url: "/trending",
                    },
                    {
                      active: pathname == "/explore",
                      content: "Explore",
                      icon: SearchMinor,
                      url: "/explore",
                    },
                    {
                      active: pathname == "/favourites",
                      content: "Favourites",
                      icon: StarOutlineMinor,
                      url: "/favourites",
                    },
                  ]}
                />
              </LegacyCard>
            </Layout.Section>
            <Layout.Section>
              <LegacyCard>
                <ActionList
                  actionRole="menuitem"
                  items={[
                    {
                      active: pathname == "/cat",
                      content: "Chat",
                      icon: ConversationMinor,
                      url: "/chat",
                    },
                    {
                      active: pathname == "/notifications",
                      content: "Notifications",
                      icon: NotificationMajor,
                      url: "/notifications",
                    },
                  ]}
                />
              </LegacyCard>
            </Layout.Section>
            <Layout.Section>
              <Card
                padding="4"
                background={
                  pathname == "/profile"
                    ? "bg-warning-subdued-experimental"
                    : "bg"
                }
              >
                <LegacyStack alignment="center" distribution="equalSpacing">
                  <Link url="/profile" removeUnderline>
                    <LegacyStack alignment="center">
                      <Avatar
                        size="medium"
                        source={user.profilePic ? user.profilePic : ""}
                      />
                      <LegacyStack vertical spacing="extraTight">
                        <Text as="h4" variant="headingSm">
                          {user?.firstName} {user?.lastName}
                        </Text>
                        <Badge icon={MentionMajor} size="small" status="info">
                          {user?.userName}
                        </Badge>
                      </LegacyStack>
                    </LegacyStack>
                  </Link>
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
                        { content: "Settings", icon: SettingsMinor },
                        {
                          content: "Logout",
                          icon: LogOutMinor,
                          onAction: handleLogout,
                        },
                      ]}
                    />
                  </Popover>
                </LegacyStack>
              </Card>
            </Layout.Section>

            <Layout.Section>
              <Button
                fullWidth
                primary
                icon={ComposeMajor}
                size="large"
                url="/create"
              >
                Create
              </Button>
            </Layout.Section>

            <Layout.Section>
              <FooterHelp>
                &copy; 2023 DotRPM.{" "}
                <Link url="https://twitter.com/pulimoodanhere" target="_blank">
                  Learn more
                </Link>
              </FooterHelp>
            </Layout.Section>
          </Layout>
        </div>
      </div>
    </Layout.Section>
  );
}

export default Navigation;
