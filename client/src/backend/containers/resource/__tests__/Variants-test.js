import { ResourceVariantsContainer } from "../Variants";

describe("backend/containers/resource/Variants", () => {
  def("resource", () => factory("resource"));
  def("root", () => <ResourceVariantsContainer resource={$resource} t={key => key} />);

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
