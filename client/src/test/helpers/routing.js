import React from "react";
import { render } from "enzyme";
import { MemoryRouter } from "react-router-dom";

export function wrapWithRouter(component) {
  return (
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
}

export function renderWithRouter(component) {
  return render(wrapWithRouter(component));
}

export default {
  renderWithRouter,
  wrapWithRouter
};
