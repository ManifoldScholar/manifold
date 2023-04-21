import { useState } from "react";

export default function useConfirmation() {
  const [confirmation, setConfirmation] = useState(null);

  const closeDialog = () => setConfirmation(null);

  const confirm = ({
    heading,
    icon,
    form,
    resolveLabel,
    callback = null,
    closeCallback
  }) => {
    const promise = new Promise((resolve, reject) => {
      const values = { reject, heading, icon, form, resolveLabel };
      if (callback) values.resolve = resolve;
      setConfirmation(values);
    });
    promise.then(
      () => {
        callback(closeDialog);
      },
      () => {
        closeCallback(closeDialog);
      }
    );
    return promise;
  };

  return { confirm, confirmation };
}
