import React from "react";
import FatalError from "global/components/FatalError";

function body(error) {
  if (error.name === "Error") return `"${error.message}"`;
  return `"${error.name}: ${error.message}"`;
}

export default function renderException(error) {
  const fatalError = {
    type: "JS_EXCEPTION",
    error: {
      status: 500,
      heading: "Client SSR Javascript Exception",
      body: body(error),
      clientTrace: error.stack,
      clientTraceTruncate: null
    }
  };
  return <FatalError fatalError={fatalError} />;
}
