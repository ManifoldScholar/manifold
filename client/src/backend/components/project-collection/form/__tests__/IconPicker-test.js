import IconPicker from "../IconPicker";

describe("backend/components/project-collection/form/IconPicker", () => {
  def("projectCollection", () => factory("projectCollection"));
  def("setOther", () => jest.fn());
  def("getModelValue", () => jest.fn(() => $projectCollection.attributes.icon));

  def("root", () => (
    <IconPicker
      projectCollection={$projectCollection}
      getModelValue={$getModelValue}
      setOther={$setOther}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($root)).toMatchSnapshot();
  });
});
