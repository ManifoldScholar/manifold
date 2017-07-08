import React from "react";
import { mount } from "enzyme";
import Confirm from "../Confirm";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Backend.Dialog.Confirm Component", () => {
  const resolveMock = jest.fn();
  const rejectMock = jest.fn();

  // https://github.com/airbnb/enzyme/issues/426
  const map = {};
  window.addEventListener = jest.fn((event, cb) => {
    map[event] = cb;
  });

  const component = mount(
    wrapWithRouter(
      <Confirm
        heading="Player's Ball"
        message="All the players came from far and wide"
        reject={rejectMock}
        resolve={resolveMock}
      />
    )
  );

  it("renders correctly", () => {
    // Confirm has event listeners attached to document,
    // so we need to use Enzyme to mock that.
    // debug() outputs the markdown generated.
    let tree = component.debug();
    expect(tree).toMatchSnapshot();
  });

  it("should trigger reject callback when cancel is clicked", () => {
    rejectMock.mockClear();
    component.find('[data-id="reject"]').first().simulate("click");
    expect(rejectMock).toHaveBeenCalled();
  });

  it("should trigger resolve callback when accept is clicked", () => {
    resolveMock.mockClear();
    component.find('[data-id="accept"]').first().simulate("click");
    expect(resolveMock).toHaveBeenCalled();
  });

  it("should trigger reject callback when escape is pressed", () => {
    rejectMock.mockClear();
    map.keyup({ keyCode: 27, preventDefault: () => undefined });
    expect(rejectMock).toHaveBeenCalled();
  });

  it("should trigger resolve callback when enter is pressed", () => {
    resolveMock.mockClear();
    map.keyup({ keyCode: 13, preventDefault: () => undefined });
    expect(resolveMock).toHaveBeenCalled();
  });
});
