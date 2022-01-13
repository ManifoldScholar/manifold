import React, { useState, useEffect } from "react";
import Block from "./Block";
import * as Styled from "./styles";

function CollectingAnimation() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setInit(true);
    }, 250);
  }, []);

  const types = [
    "projects",
    "texts",
    "textSections",
    "resourceCollections",
    "resources"
  ];
  return (
    <Styled.Animation
      role="img"
      aria-label="A grid of tiles with star icons that fade in."
      $init={init}
    >
      {types.map(type => (
        <Block key={type} type={type} />
      ))}
    </Styled.Animation>
  );
}

export default CollectingAnimation;
