import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useUID } from "react-uid";
import * as Styled from "./styles";

export default function Tooltip({
  children,
  content,
  xOffset = 0,
  yOffset = 20,
  delay = 0
}) {
  const [userClosed, setUserClosed] = useState(false);
  const tooltipRef = useRef(null);

  useEffect(() => {
    const handleEsc = e => {
      if (e.key !== "Escape") return;
      setUserClosed(true);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const resetEscape = () => {
    setUserClosed(false);
  };

  const uid = useUID();

  const renderContent =
    typeof content === "string" ? (
      <Styled.ContentWrapper>{content}</Styled.ContentWrapper>
    ) : (
      content
    );

  return children && content ? (
    <Styled.Wrapper>
      {React.cloneElement(children, {
        "aria-describedby": uid,
        onBlur: resetEscape,
        onMouseLeave: resetEscape
      })}
      <Styled.Tooltip
        ref={tooltipRef}
        role="tooltip"
        id={uid}
        $xOffset={xOffset}
        $yOffset={yOffset}
        $userClosed={userClosed}
        $delay={delay}
      >
        {renderContent}
      </Styled.Tooltip>
    </Styled.Wrapper>
  ) : null;
}

Tooltip.displayName = "Global.Atomic.Tooltip";

Tooltip.propTypes = {
  content: PropTypes.node,
  xOffset: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  yOffset: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
