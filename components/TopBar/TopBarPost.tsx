import {
  Icon,
  Layout,
  LegacyStack,
  LegacyTabs,
  Page,
  Text,
} from "@shopify/polaris";
import { SmileyJoyMajor, ArrowLeftMinor } from "@shopify/polaris-icons";
import styles from "./topbar.module.css";

function TopBarPost() {
  return (
    <Layout.Section fullWidth>
      <div
        style={{
          position: "fixed",
          width: "100%",
          zIndex: 200,
          left: 0,
          top: 0,
          backdropFilter: "blur(20px)",
          height: "73px",
        }}
      >
        <Page>
          <Layout>
            <Layout.Section secondary>
              <div className={styles.logo}>
                <LegacyTabs
                  tabs={[
                    {
                      content: (
                        <LegacyStack alignment="center" spacing="baseTight">
                          <Icon source={SmileyJoyMajor} color="magic" />
                          <Text as="h1" variant="headingSm">
                            Chali
                          </Text>
                        </LegacyStack>
                      ),
                      id: "chali",
                    },
                  ]}
                  selected={0}
                />
              </div>
            </Layout.Section>
            <Layout.Section>
              <LegacyTabs
                selected={0}
                tabs={[
                  {
                    content: (
                      <LegacyStack alignment="center" spacing="extraTight">
                        <Icon source={ArrowLeftMinor} color="base" />
                        <Text as="p">Go back</Text>
                      </LegacyStack>
                    ),
                    id: "go-back",
                    url: "/",
                  },
                ]}
              />
            </Layout.Section>
          </Layout>
        </Page>
      </div>
    </Layout.Section>
  );
}

export default TopBarPost;
