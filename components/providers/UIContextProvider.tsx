import { useState, ReactNode } from "react";
import { Toast } from "@shopify/polaris";
import { UIContext } from "../hooks/uiContext";

interface Props {
  children: ReactNode;
}

const UIContextProvider = ({ children }: Props) => {
  // Toast
  const [toastDuration, setToastDuration] = useState(2000);
  const [toastActive, setToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isError, setError] = useState(false);

  const toastMarkup = toastActive ? (
    <Toast
      content={toastMessage}
      error={isError}
      duration={toastDuration}
      onDismiss={() => {
        setToastActive(false);
      }}
    />
  ) : null;

  const showToast = (message: string, duration = 4000) => {
    setToastDuration(duration);
    setError(false);
    setToastMessage(message);
    setToastActive(true);
  };

  const showErrorToast = (message: string, duration = 4000) => {
    setToastDuration(duration);
    setError(true);
    setToastMessage(message);
    setToastActive(true);
  };

  return (
    <UIContext.Provider
      value={{
        toast: {
          show: showToast,
          showError: showErrorToast,
        },
      }}
    >
      {children}
      {toastMarkup}
    </UIContext.Provider>
  );
};

export default UIContextProvider;
