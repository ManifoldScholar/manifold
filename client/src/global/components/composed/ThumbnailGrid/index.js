import React, { useState } from "react";
import EntityThumbnail from "global/components/atomic/EntityThumbnail";
import * as Styled from "./styles";
import PropTypes from "prop-types";
import useResizeObserver from "use-resize-observer";

export default function ThumbnailGrid({
  minItemWidth = "200px",
  minColumns = 2,
  children
}) {
  const [useGrid, setUseGrid] = useState(true);
  const breakpoint = parseInt(minItemWidth, 10) * minColumns;
  const { ref: resizeRef } = useResizeObserver({
    onResize: ({ width }) => {
      if (width > breakpoint) return setUseGrid(true);
      return setUseGrid(false);
    }
  });

  return (
    <Styled.Grid
      ref={resizeRef}
      $grid={useGrid}
      $empty={!children}
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
