import React, { forwardRef } from "react";
import Utility from "global/components/utility";
import * as Styled from "./styles";

const FunctionButton = (
  { ariaLabel, label, icon, onClick, isFirst, ...rest },
  ref
) => {
  const Button = label ? Styled.StylesButton : Styled.Button;
  return (
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
};

export default forwardRef(FunctionButton);
