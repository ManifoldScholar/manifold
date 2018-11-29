import React from "react";
import renderer from "react-test-renderer";
import Detail from "../Detail";
import build from "test/fixtures/build";
import { Provider } from "react-redux";

describe("Global.Comment.Detail component", () => {
  const store = build.store();

  const handleDeleteMock = jest.fn();
  const handleDestroyMock = jest.fn();
  const handleRestoreMock = jest.fn();
  const handleFlagMock = jest.fn();
  const subject = build.entity.resource("1");
  const comment = build.entity.comment("2");
  comment.relationships.creator = build.entity.user("3");

  it("renders correctly", () => {
    const component = renderer.create(
      <Provider store={store}>
        <Detail
          handleDelete={handleDeleteMock}
          handleDestroy={handleDestroyMock}
          handleRestore={handleRestoreMock}
          handleFlag={handleFlagMock}
          subject={subject}
          comment={comment}
        />
      </Provider>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
