import Detail from "../Detail";

describe("frontend/components/resource/Detail", () => {
  def("resource", () => factory("resource"));
  def("root", () => (
    <Detail resource={$resource} resourceUrl="resource/url" t={key => key} />
  ));

  it("matches the snapshot", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});
