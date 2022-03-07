import { FormContainer } from "../Form";

describe("global/containers/form/Form", () => {
  def("session", () => ({
    changed: false,
    dirty: {
      attributes: {},
      relationships: {}
    },
    source: $project
  }));
  def("project", () => factory("project"));
  def("createMock", () => jest.fn());
  def("updateMock", () => jest.fn());
  def("root", () => (
    <FormContainer
      session={$session}
      dispatch={$dispatch}
      create={$createMock}
      update={$updateMock}
      name="test"
      t={key => key}
    />
  ));
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
