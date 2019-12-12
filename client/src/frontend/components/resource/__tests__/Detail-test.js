import Detail from "../Detail";

describe("frontend/components/resource/Detail", () => {
  def("resource", () => factory("resource"));
  def("root", () => (
    <Detail
      resource={$resource}
      resourceUrl="resource/url"
      projectUrl="project/url"
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
