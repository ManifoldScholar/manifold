import React from "react";
import { MemoryRouter } from "react-router-dom";
import Adapter from "enzyme-adapter-react-16";
import Enzyme from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

export function wrapWithRouter(component) {
  return (
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
}

export function renderWithRouter(component) {
  return Enzyme.render(wrapWithRouter(component));
}

export default {
  renderWithRouter,
  wrapWithRouter
};
