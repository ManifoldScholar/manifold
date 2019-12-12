import Preview from "../";

describe("frontend/components/resource-preview/Preview", () => {
  def("resource", () => factory("resource"));
  def("root", () => (
    <Preview resource={$resource}>
      <div>Test Button</div>
    </Preview>
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
