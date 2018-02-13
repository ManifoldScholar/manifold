import React from "react";
import { renderWithRouter, wrapWithRouter } from "test/helpers/routing";
import renderer from "react-test-renderer";
import Totals from "../Totals";
import build from "test/fixtures/build";

const project = build.entity.project("1");

describe("Frontend.ResourceList.Totals Component", () => {
  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(<Totals count={3} project={project} />)
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("displays the correct count", () => {
    const wrapper = renderWithRouter(<Totals count={3} project={project} />);
    expect(wrapper.find('[data-id="count"]').text()).toBe("3");
  });

  it("doesn't render the count when there is no count", () => {
    const wrapper = renderWithRouter(<Totals count={null} project={project} />);
    expect(wrapper.find('[data-id="count"]')).toHaveLength(0);
  });
});
