import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { useUIDSeed } from "react-uid";
import useResizeObserver from "use-resize-observer";
import { CollapseContext } from "helpers/contexts";
import Toggle from "./Toggle";
import Content from "./Content";

function Collapse({ initialVisible, children, stubHeight, label }) {
  const [visible, setVisible] = useState(initialVisible);
  const toggleVisible = () => setVisible(!visible);
  const idSeed = useUIDSeed();
  const toggleProps = {
    type: "button",
    "aria-expanded": visible,
    "aria-controls": idSeed("content"),
    onClick: toggleVisible
  };
  const labelProps = {
    id: idSeed("label")
  };
  const { ref: resizeRef, height } = useResizeObserver();
  const contentProps = {
    id: idSeed("content"),
    role: "region",
    "aria-label": label,
    "aria-labelledby": !label ? idSeed("label") : undefined,
    inert: !visible && (!stubHeight || stubHeight < height) ? "" : undefined,
    resizeRef
  };

  const value = useMemo(
    () => ({
      visible,
      toggleProps,
      labelProps,
      contentProps,
      toggleVisible,
      height,
      stubHeight
    }),
    [visible, idSeed, height, stubHeight] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    setVisible(initialVisible);
  }, [initialVisible]);

  return (
    <CollapseContext.Provider value={value}>
      {children}
    </CollapseContext.Provider>
  );
}

Collapse.displayName = "Global.Collapse";

Collapse.propTypes = {
  initialVisible: PropTypes.bool,
  stubHeight: PropTypes.number,
  label: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
};

Collapse.Toggle = Toggle;
Collapse.Content = Content;

export default Collapse;
