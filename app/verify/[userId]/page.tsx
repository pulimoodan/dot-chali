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
import React, { useEffect, useState, useContext } from "react";
import styles from "./page.module.css";
import { SmileyJoyMajor } from "@shopify/polaris-icons";
import { resendOtpToUserId, verifyOtpByUserId } from "../verify";
import { useRouter } from "next/navigation";
import { UserContext } from "@/components/hooks/userContext";

interface Params {
  params: {
    userId: string;
  };
}

function Verify({ params }: Params) {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState(
    "An email with a 6 digit OTP has been sent to your email"
  );
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);

  const handleResendOTP = async () => {
    const res = await resendOtpToUserId(params.userId);
    if (res?.error) {
      setError(res.error);
    } else {
      setMessage("A new OTP has been resent to your email");
    }
    setTimer(60);
  };

  const hanldeOTPVerification = async () => {
    setVerifying(true);
    try {
      await verifyOtpByUserId(params.userId, Number(otp));
    } catch (e) {
      setError((e as Error).message);
    }
    setVerifying(false);
  };

  useEffect(() => {
    setInterval(function () {
      setTimer((state) => {
        if (state != 0) return --state;
        else return 0;
      });
    }, 1000);
  }, []);

  const { user, loaded } = useContext(UserContext);

  useEffect(() => {
    if (loaded && user) router.push("/");
  }, [loaded]);

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
                          Verify your email
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
              <LegacyCard.Section subdued>
                <Text as="p" color="subdued">
                  {message}
                </Text>
              </LegacyCard.Section>
              <LegacyCard.Section>
                <FormLayout>
                  <TextField
                    value={otp}
                    onChange={(value) => setOtp(value)}
                    label="OTP"
                    type="text"
                    placeholder="000-000"
                    autoComplete="email"
                  />
                </FormLayout>
              </LegacyCard.Section>
            </LegacyCard>
          </Layout.Section>
          <Layout.Section>
            <Button
              fullWidth
              primary
              onClick={hanldeOTPVerification}
              loading={verifying}
            >
              Verify
            </Button>
          </Layout.Section>
          <Layout.Section>
            <LegacyStack alignment="center" distribution="equalSpacing">
              <Text as="p" color="subdued">
                <Button disabled={timer > 0} onClick={handleResendOTP} plain>
                  Resend
                </Button>{" "}
                the OTP in {timer} seconds.
              </Text>
              <Button url="/signup">Go back</Button>
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

export default Verify;
