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
  Page,
  Text,
  TextField,
} from "@shopify/polaris";
import React, { useState } from "react";
import styles from "./page.module.css";
import { SmileyJoyMajor } from "@shopify/polaris-icons";
import { SignUpEntity, createUser } from "./signup";
import { useRouter } from "next/navigation";

function SignUp() {
  const [data, setData] = useState<SignUpEntity>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(false);

  const handleSignup = async () => {
    setFetching(true);
    let hasError = false;

    // check if anything is empty
    const isEmptyValue = Object.entries(data).filter(([key, value]) => {
      if (!value) key;
    });
    if (isEmptyValue.length > 0) {
      setError("Please fill out the fields");
      hasError = true;
    }

    // check email
    const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    if (!data.email.match(pattern)) {
      setError("Invalid email");
      hasError = true;
    }

    if (!hasError) {
      const res = await createUser(data);
      if (res?.error) setError(res.error);
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
                          Sign up with Chali
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
                  <FormLayout.Group condensed>
                    <TextField
                      label="First Name"
                      value={data?.firstName}
                      onChange={(value) =>
                        setData((state) => {
                          return {
                            ...state,
                            firstName: value,
                          };
                        })
                      }
                      autoComplete="off"
                    />
                    <TextField
                      label="Last Name"
                      value={data?.lastName}
                      onChange={(value) =>
                        setData((state) => {
                          return {
                            ...state,
                            lastName: value,
                          };
                        })
                      }
                      autoComplete="off"
                    />
                  </FormLayout.Group>
                  <TextField
                    value={data?.email}
                    onChange={(value) =>
                      setData((state) => {
                        return {
                          ...state,
                          email: value,
                        };
                      })
                    }
                    label="Email"
                    type="email"
                    autoComplete="email"
                  />
                  <TextField
                    value={data?.password}
                    onChange={(value) =>
                      setData((state) => {
                        return {
                          ...state,
                          password: value,
                        };
                      })
                    }
                    label="Password"
                    type="password"
                    autoComplete="off"
                  />
                </FormLayout>
              </LegacyCard.Section>
            </LegacyCard>
          </Layout.Section>
          <Layout.Section>
            <Button fullWidth primary onClick={handleSignup} loading={fetching}>
              Sign Up
            </Button>
          </Layout.Section>
          <Layout.Section>
            <LegacyStack alignment="center" distribution="equalSpacing">
              <Text as="p" color="subdued">
                Already have an account? Then click sign in.
              </Text>
              <Button url="/login">Sign In</Button>
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

export default SignUp;
