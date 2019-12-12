import Cover from "../Cover";

describe("frontend/components/resource-collection/Cover", () => {
  def("resources", () => collectionFactory("resource"));
  def("resourceCollection", () =>
    factory("resourceCollection", { relatioships: { resources: $resources } })
  );

  def("root", () => (
    <Cover
      resourceCollection={$resourceCollection}
      urlCreator={resourceCollection =>
        `/project/slug-1/${resourceCollection.attributes.slug}`
      }
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
