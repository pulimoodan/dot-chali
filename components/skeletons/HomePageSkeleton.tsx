import {
  Button,
  Layout,
  LegacyCard,
  LegacyStack,
  Page,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonTabs,
} from "@shopify/polaris";

function HomePageSkeleton() {
  return (
    <Page>
      <Layout>
        <Layout.Section fullWidth>
          <Layout>
            <Layout.Section secondary>
              <SkeletonTabs count={1} />
            </Layout.Section>
            <Layout.Section>
              <SkeletonTabs count={2} />
            </Layout.Section>
          </Layout>
        </Layout.Section>
        <Layout.Section secondary>
          <Layout>
            <Layout.Section>
              <LegacyCard sectioned>
                <LegacyStack vertical>
                  <SkeletonDisplayText size="small" />
                  <SkeletonDisplayText size="small" />
                  <SkeletonDisplayText size="small" />
                  <SkeletonDisplayText size="small" />
                </LegacyStack>
              </LegacyCard>
            </Layout.Section>
            <Layout.Section>
              <LegacyCard sectioned>
                <LegacyStack vertical>
                  <SkeletonDisplayText size="small" />
                  <SkeletonDisplayText size="small" />
                </LegacyStack>
              </LegacyCard>
            </Layout.Section>
            <Layout.Section>
              <LegacyCard sectioned>
                <LegacyStack vertical>
                  <SkeletonDisplayText size="small" />
                </LegacyStack>
              </LegacyCard>
            </Layout.Section>
            <Layout.Section>
              <Button pressed fullWidth></Button>
            </Layout.Section>
            <Layout.Section>
              <SkeletonBodyText lines={1} />
            </Layout.Section>
          </Layout>
        </Layout.Section>
        <Layout.Section>
          <div style={{ height: "85vh", overflow: "hidden" }}>
            <LegacyCard>
              <LegacyCard.Section>
                <SkeletonDisplayText size="extraLarge" />
              </LegacyCard.Section>
              <LegacyCard.Section>
                <SkeletonBodyText lines={5} />
              </LegacyCard.Section>
              <LegacyCard.Section>
                <SkeletonDisplayText />
              </LegacyCard.Section>
            </LegacyCard>
            <LegacyCard>
              <LegacyCard.Section>
                <SkeletonDisplayText size="extraLarge" />
              </LegacyCard.Section>
              <LegacyCard.Section>
                <SkeletonBodyText lines={5} />
              </LegacyCard.Section>
              <LegacyCard.Section>
                <SkeletonDisplayText />
              </LegacyCard.Section>
            </LegacyCard>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default HomePageSkeleton;
