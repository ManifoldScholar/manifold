import React, { useState, useEffect } from "react";
import classNames from "classnames";
import Block from "./Block";

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
    <div
      role="img"
      aria-label="A grid of tiles with star icons that fades in."
      className={classNames({
        "collecting-placeholder-animation": true,
        "collecting-placeholder-animation--animate": init
      })}
    >
      {types.map(type => (
        <Block key={type} type={type} />
      ))}
    </div>
  );
}

export default CollectingAnimation;
