import React from "react";
import validatedNode from "../higher-order/ValidatedNode";

function Video({ attributes, children }) {
  const { height, width, style, controls: controlsAttr, ...renderAttrs } =
    attributes ?? {};
  const { height: styleH, width: styleW, ...renderStyles } = style ?? {};

  const h = parseInt(styleH ?? height, 10);
  const w = parseInt(styleW ?? width, 10);

  // Set the wrapper's aspect ratio from the specified dimensions. When either
  // is missing or invalid, fall back to the stylesheet's default ratio.
  const aspectRatio = h > 0 && w > 0 ? `${w} / ${h}` : undefined;

  const controls = controlsAttr || controlsAttr === "true" ? true : undefined;

  const renderVideo = children ? (
    <video controls={controls} {...renderAttrs} style={renderStyles}>
      {children}
    </video>
  ) : (
    <video controls={controls} {...renderAttrs} style={renderStyles} />
  );

  return (
    <span style={{ aspectRatio }} className="responsive-iframe">
      {renderVideo}
    </span>
  );
}

export default validatedNode(Video);
