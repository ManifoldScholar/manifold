import React from "react";
import styles from "theme/styles/GlobalStyles";
import { Global } from '@emotion/react'
console.log(styles, 'styles');
export default function Theme({ children }) {
  return (
    <>
      <Global styles={styles}/ >
      {children}
    </>
  )
}
