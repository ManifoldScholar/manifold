import { ResourceCollectionPropertiesContainer } from "../Properties";

describe("backend/containers/resource-collection/Properties", () => {
  def("resourceCollection", () => factory("resourceCollection"));
  def("root", () => (
    <ResourceCollectionPropertiesContainer
      resourceCollection={$resourceCollection}
      t={key => key}
    />
  ));
  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
