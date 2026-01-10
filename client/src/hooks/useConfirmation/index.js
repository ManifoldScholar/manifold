import { useState } from "react";

export default function useConfirmation() {
  const [confirmation, setConfirmation] = useState(null);

  const closeDialog = () => setConfirmation(null);

  const confirm = ({
    heading,
    message,
    icon,
    form,
    resolveLabel,
    callback = null,
    closeCallback
  }) => {
    const promise = new Promise((resolve, reject) => {
      const handleReject = () => {
        closeDialog();
        reject();
      };
      const values = {
        reject: handleReject,
        heading,
        message,
        icon,
        form,
        resolveLabel
      };
      if (callback) values.resolve = resolve;
      setConfirmation(values);
    });
    promise.then(
      () => {
        callback(closeDialog);
      },
      () => {
        if (closeCallback) closeCallback(closeDialog);
      }
    );
    return promise;
  };

  return { confirm, confirmation };
}
