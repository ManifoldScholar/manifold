import React from "react";
import manifoldContext from "./decorators/manifoldContext";
import "focus-visible";
// Import global styles.
import "theme";

export const decorators = [Story => manifoldContext(<Story />)];
