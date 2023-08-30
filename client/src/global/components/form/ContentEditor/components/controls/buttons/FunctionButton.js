import React, { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import Utility from "global/components/utility";
import Tooltip from "global/components/atomic/Tooltip";
import TooltipContent from "./TooltipContent";
import { hotkeys } from "./TooltipContent/content";
import * as Styled from "./styles";

const FunctionButton = (
  { label, icon, onClick, isFirst, tooltip, ...rest },
  ref
) => {
  const { t } = useTranslation();

  const Button = label ? Styled.StylesButton : Styled.Button;
  const renderButton = (
    <Button
      ref={ref}
      {...rest}
      aria-label={t("editor.controls.labels.format", { format: tooltip })}
      onClick={onClick}
      tabIndex={isFirst ? 0 : -1}
    >
      {icon && <Utility.IconComposer icon={icon} size={24} />}
      {label && label}
    </Button>
  );

  return tooltip ? (
    <Tooltip
      content={
        <TooltipContent
          label={t(`editor.tooltips.labels.${tooltip}`)}
          hotkeys={hotkeys[tooltip]}
          description={t(`editor.tooltips.descriptions.${tooltip}`)}
        />
      }
      xOffset="-50px"
      yOffset="43px"
      delay={0.5}
    >
      {renderButton}
    </Tooltip>
  ) : (
    renderButton
  );
};

export default forwardRef(FunctionButton);
