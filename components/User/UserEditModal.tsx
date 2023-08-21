import { checkUserName } from "@/app/user";
import { FormLayout, Modal, TextField } from "@shopify/polaris";
import React, { useEffect, useMemo, useState } from "react";
import { useUIContext } from "../hooks/uiContext";

interface Props {
  user: {
    userId: string;
    userName: string;
    firstName: string;
    lastName: string;
  };
  active: boolean;
  close: () => void;
  save: (a: string, b: string, c: string) => Promise<boolean>;
}

function UserEditModal({ user, active, close, save }: Props) {
  const { toast } = useUIContext();
  const [userName, setUserName] = useState(user.userName);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [dirty, setDirty] = useState(false);
  const [userNameAvailable, setUserNameAvailable] = useState(true);
  const [fetching, setFetching] = useState(false);

  const handleSave = async () => {
    setFetching(true);
    await save(userName, firstName, lastName);
    setFetching(false);
    toast.show("Details saved");
    close();
  };

  const checkDirty = () => {
    if (
      userName == user.userName &&
      firstName == user.firstName &&
      lastName == user.lastName
    )
      setDirty(false);
    else setDirty(true);
  };

  useMemo(async () => {
    setFetching(true);
    checkDirty();
    if (userName == user.userName) setUserNameAvailable(true);
    else {
      const isAvailable = await checkUserName(userName);
      setUserNameAvailable(isAvailable);
    }
    setFetching(false);
  }, [userName]);

  useMemo(() => {
    checkDirty();
  }, [firstName, lastName]);

  useEffect(() => {
    if (active) {
      setUserName(user.userName);
      setFirstName(user.firstName);
      setLastName(user.lastName);
    }
  }, [active]);

  return (
    <Modal
      open={active}
      onClose={close}
      title="Edit personal details"
      primaryAction={{
        content: "Save",
        onAction: handleSave,
        disabled: !dirty || !userNameAvailable,
        loading: fetching,
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: close,
        },
      ]}
    >
      <Modal.Section>
        <FormLayout>
          <FormLayout.Group condensed>
            <TextField
              label="First name"
              autoComplete="off"
              value={firstName}
              onChange={(value) => setFirstName(value)}
            />
            <TextField
              label="Last name"
              autoComplete="off"
              value={lastName}
              onChange={(value) => setLastName(value)}
            />
          </FormLayout.Group>
          <FormLayout.Group>
            <TextField
              label="Username"
              autoComplete="off"
              value={userName}
              onChange={(value) => setUserName(value)}
              error={!userNameAvailable}
              helpText={
                !userNameAvailable
                  ? "Username not available"
                  : "Username available"
              }
            />
          </FormLayout.Group>
        </FormLayout>
      </Modal.Section>
    </Modal>
  );
}

export default UserEditModal;
