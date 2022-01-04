import React, { useState } from "react";
import EntityThumbnail from "global/components/atomic/EntityThumbnail";
import * as Styled from "./styles";
import PropTypes from "prop-types";
import useResizeObserver from "use-resize-observer";
import classnames from "classnames";

/* BREAKPOINT must equal 2x minItemWidth for FE (and 3x for BE?) or icon size is off near the breakpoint. */
const BREAKPOINT = 600;

export default function ThumbnailGrid({ minItemWidth = "200px", children }) {
  const [useGrid, setUseGrid] = useState(true);
  const { ref: resizeRef } = useResizeObserver({
    onResize: ({ width }) => {
      if (width > BREAKPOINT) return setUseGrid(true);
      return setUseGrid(false);
    }
  });

  return (
    <Styled.Grid
      ref={resizeRef}
      className={classnames({ grid: useGrid, empty: !children })}
      $grid={useGrid}
      $minItemWidth={minItemWidth}
    >
      {typeof children === "function" ? children({ stack: useGrid }) : children}
    </Styled.Grid>
  );
}

EntityThumbnail.propTypes = {
  minItemWidth: PropTypes.string,
  children: PropTypes.node
};
