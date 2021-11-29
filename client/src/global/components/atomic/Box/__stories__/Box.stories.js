import React from "react";
import { storiesOf } from "helpers/storybook/exports";
import Box from "..";

storiesOf("Global/Box", module).add("Default", () => {
  return (
    <Box>
      <div style={{ height: "300px", width: "300px" }} />
    </Box>
  );
});
