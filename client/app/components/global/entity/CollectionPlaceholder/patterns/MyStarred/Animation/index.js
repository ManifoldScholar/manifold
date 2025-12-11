import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Block from "./Block";
import * as Styled from "./styles";

function CollectingAnimation() {
  const [init, setInit] = useState(false);
  const { t } = useTranslation();

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
      aria-label={t("placeholders.my_starred.animation_label")}
      $init={init}
    >
      {types.map(type => (
        <Block key={type} type={type} />
      ))}
    </Styled.Animation>
  );
}

export default CollectingAnimation;
