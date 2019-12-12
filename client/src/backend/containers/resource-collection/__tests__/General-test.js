import { ResourceCollectionGeneralContainer } from "../General";

describe("backend/containers/resource-collection/General", () => {
  def("resourceCollection", () => factory("resourceCollection"));
  def("root", () => (
    <ResourceCollectionGeneralContainer
      resourceCollection={$resourceCollection}
    />
  ));
  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
