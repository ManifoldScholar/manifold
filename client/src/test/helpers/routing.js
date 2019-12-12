import React from "react";
import { MemoryRouter } from "react-router-dom";

export function wrapWithRouter(component) {
  return (
    <MemoryRouter initialEntries={[{ pathname: "/", key: "test-key" }]}>
      {component}
    </MemoryRouter>
  );
}
