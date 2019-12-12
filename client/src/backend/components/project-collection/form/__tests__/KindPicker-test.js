import KindPicker from "../KindPicker";

describe("backend/components/project-collection/form/KindPicker", () => {
  def("projectCollection", () => factory("projectCollection"));
  def("getModelValue", () =>
    jest.fn(() => $projectCollection.attributes.smart)
  );
  def("setOther", () => jest.fn());
  def("root", () => (
    <KindPicker getModelValue={$getModelValue} setOther={$setOther} />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
