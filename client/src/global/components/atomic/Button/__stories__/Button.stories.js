import React from "react";
import { storiesOf } from "helpers/storybook/exports";
import Button from "..";

storiesOf("Global/Button", module)
  .add("Primary", () => {
    return (
      <div
        style={{
          minHeight: "100px",
          paddingBlockStart: "30px",
          paddingInlineStart: "10px"
        }}
      >
        <Button icon="link24" iconSize={24}>
          Primary
        </Button>
      </div>
    );
  })
  .add("Primary Large", () => {
    return (
      <div
        style={{
          minHeight: "100px",
          paddingBlockStart: "30px",
          paddingInlineStart: "10px"
        }}
      >
        <Button size="lg" icon="glasses64" iconSize={46}>
          Primary Lg
        </Button>
      </div>
    );
  })
  .add("Secondary", () => {
    return (
      <div
        style={{
          minHeight: "100px",
          paddingBlockStart: "30px",
          paddingInlineStart: "10px"
        }}
      >
        <Button secondary icon="link24" iconSize={24}>
          Secondary
        </Button>
      </div>
    );
  })
  .add("Secondary Dark", () => {
    return (
      <div
        style={{
          minHeight: "100px",
          paddingBlockStart: "30px",
          paddingInlineStart: "10px"
        }}
      >
        <Button secondary dark icon="link24" iconSize={24}>
          Secondary Dark
        </Button>
      </div>
    );
  })
  .add("Secondary Large", () => {
    return (
      <div
        style={{
          minHeight: "100px",
          paddingBlockStart: "30px",
          paddingInlineStart: "10px"
        }}
      >
        <Button secondary size="lg" icon="glasses64" iconSize={46}>
          Secondary Lg
        </Button>
      </div>
    );
  })
  .add("Fixed Width", () => {
    return (
      <div
        style={{
          minHeight: "100px",
          paddingBlockStart: "30px",
          paddingInlineStart: "10px"
        }}
      >
        <Button width={260} size="lg" icon="glasses64" iconSize={46}>
          Fixed Width
        </Button>
      </div>
    );
  });
