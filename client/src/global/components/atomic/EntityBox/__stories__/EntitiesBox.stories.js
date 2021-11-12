import React from "react";
import { storiesOf } from "helpers/storybook/exports";
import EntitiesBox from "..";

storiesOf("Global/EntitiesBox", module).add("Default", () => {
  return (
    <div className="bg-white">
      <EntitiesBox>
        <div style={{ height: "300px", width: "300px" }} />
      </EntitiesBox>
    </div>
  );
});
