import React, { forwardRef } from "react";
import Utility from "global/components/utility";
import Tooltip from "global/components/atomic/Tooltip";
import TooltipContent from "./TooltipContent";
import { hotkeys, labels, descriptions } from "./TooltipContent/hotkeys";
import * as Styled from "./styles";

const FunctionButton = (
  { ariaLabel, label, icon, onClick, isFirst, tooltip, ...rest },
  ref
) => {
  const Button = label ? Styled.StylesButton : Styled.Button;
  const renderButton = (
    <Button
      ref={ref}
      {...rest}
      aria-label={ariaLabel}
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
          label={labels[tooltip]}
          hotkeys={hotkeys[tooltip]}
          description={descriptions[tooltip]}
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
