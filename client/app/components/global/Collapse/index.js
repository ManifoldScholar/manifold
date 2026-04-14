import { useState, useMemo, useEffect, useId } from "react";
import PropTypes from "prop-types";
import useResizeObserver from "use-resize-observer";
import { CollapseContext } from "helpers/contexts";
import Toggle from "./Toggle";
import Content from "./Content";

function Collapse({ initialVisible, children, stubHeight, label }) {
  const [visible, setVisible] = useState(initialVisible);
  const toggleVisible = () => setVisible(!visible);
  const baseId = useId();
  const toggleProps = {
    type: "button",
    "aria-expanded": visible,
    "aria-controls": `${baseId}-content`,
    onClick: toggleVisible
  };
  const labelProps = {
    id: `${baseId}-label`
  };
  const { ref: resizeRef, height } = useResizeObserver();
  const contentProps = {
    id: `${baseId}-content`,
    role: "region",
    "aria-label": label,
    "aria-labelledby": !label ? `${baseId}-label` : undefined,
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
    [visible, baseId, height, stubHeight] // eslint-disable-line react-hooks/exhaustive-deps
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
