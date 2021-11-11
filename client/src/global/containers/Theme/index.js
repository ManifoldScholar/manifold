import React from "react";
import { Global } from "@emotion/react";
import styles from "theme/styles/globalStyles";

export default function Theme({ children }) {
  return (
    <>
      <Global styles={styles} />
      {children}
    </>
  );
}
