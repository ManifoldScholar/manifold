import KindPicker from "../KindPicker";

describe("backend/components/resource/form/KindPicker", () => {
  def("getModelValue", () => jest.fn(() => "image"));
  def("root", () => (
    <KindPicker
      name="attributes[kind]"
      getModelValue={$getModelValue}
      includeButtons
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($root)).toMatchSnapshot();
  });
});
