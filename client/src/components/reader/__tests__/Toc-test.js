import React from "react";
import renderer from "react-test-renderer";
import Toc from "../Toc";
import { mount } from "enzyme";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Reader.Toc Component", () => {
  const text = build.entity.text("1");
  const textWithoutToc = build.entity.text("2", { toc: [] });
  const hideTocMock = jest.fn();

  const root = wrapWithRouter(
    <Toc text={text} tocDrawerVisible hideTocDrawer={hideTocMock} />
  );

  it("renders correctly", () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("renders correctly with empty toc", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Toc text={textWithoutToc} tocDrawerVisible hideTocDrawer={hideTocMock} />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("should trigger hideTocDrawer callback when toggle is clicked", () => {
    const wrapper = mount(root);
    hideTocMock.mockClear();
    wrapper
      .find('[data-id="hide-drawer"]')
      .first()
      .simulate("click");
    expect(hideTocMock).toHaveBeenCalled();
  });
});
