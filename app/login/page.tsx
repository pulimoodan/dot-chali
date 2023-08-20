"use client";
import {
  Button,
  FormLayout,
  Icon,
  InlineError,
  Layout,
  LegacyCard,
  LegacyStack,
  LegacyTabs,
  Link,
  Page,
  Text,
  TextField,
} from "@shopify/polaris";
import { useState } from "react";
import styles from "./page.module.css";
import { SmileyJoyMajor } from "@shopify/polaris-icons";
import { loginUser } from "./login";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setFetching(true);
    try {
      await loginUser({ email, password });
    } catch (e) {
      setError((e as Error).message);
    }
    setFetching(false);
  };

  return (
    <Page narrowWidth>
      <div
        style={{
          minHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: "400px",
          margin: "0 auto",
        }}
      >
        <Layout>
          <Layout.Section>
            <div className={styles.logo}>
              <LegacyTabs
                tabs={[
                  {
                    content: (
                      <LegacyStack alignment="center" spacing="baseTight">
                        <Icon source={SmileyJoyMajor} color="magic" />
                        <Text as="h1" variant="headingSm">
                          Sign into Chali
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
          <Layout.Section oneThird>
            <LegacyCard>
              <LegacyCard.Section>
                <FormLayout>
                  <TextField
                    value={email}
                    onChange={(value) => setEmail(value)}
                    label="Email"
                    type="email"
                    autoComplete="email"
                  />
                  <TextField
                    value={password}
                    onChange={(value) => setPassword(value)}
                    label="Password"
                    type="password"
                    autoComplete="off"
                  />
                </FormLayout>
              </LegacyCard.Section>
              <LegacyCard.Section subdued>
                <Text as="p" color="subdued">
                  Forgot password? <Link>Click here</Link> to recover your
                  password.
                </Text>
              </LegacyCard.Section>
            </LegacyCard>
          </Layout.Section>
          <Layout.Section>
            <Button fullWidth primary onClick={handleLogin} loading={fetching}>
              Sign In
            </Button>
          </Layout.Section>
          <Layout.Section>
            <LegacyStack alignment="center" distribution="equalSpacing">
              <Text as="p" color="subdued">
                Don't have an account yet? Then click sign up.
              </Text>
              <Button url="/signup">Sign Up</Button>
            </LegacyStack>
          </Layout.Section>
          <Layout.Section>
            {error && <InlineError message={error} fieldID="error" />}
          </Layout.Section>
        </Layout>
      </div>
    </Page>
  );
}

export default Login;
