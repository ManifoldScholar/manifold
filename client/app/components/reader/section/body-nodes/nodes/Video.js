import React from "react";
import validatedNode from "../higher-order/ValidatedNode";

function Video({ attributes, children }) {
  const { height, width, style, controls: controlsAttr, ...renderAttrs } =
    attributes ?? {};
  const { height: styleH, width: styleW, ...renderStyles } = style ?? {};

  const h = parseInt(styleH ?? height, 10);
  const w = parseInt(styleW ?? width, 10);

  const paddingTop = !h || !w ? undefined : "56.25%";

  const controls = controlsAttr || controlsAttr === "true" ? true : undefined;

  const renderVideo = children ? (
    <video controls={controls} {...renderAttrs} style={renderStyles}>
      {children}
    </video>
  ) : (
    <video controls={controls} {...renderAttrs} style={renderStyles} />
  );

  return (
    <span style={{ paddingTop }} className="responsive-iframe">
      {renderVideo}
    </span>
  );
}

export default validatedNode(Video);
