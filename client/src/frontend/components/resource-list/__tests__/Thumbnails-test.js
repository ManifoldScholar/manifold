import Thumbnails from "../Thumbnails";

describe("frontend/components/resource-list/Thumbnails", () => {
  def("project", () => factory("project"));

  def("resources", () =>
    collectionFactory("resource", 3, (type, index) => {
      return {
        id: `${type}-${index}`,
        relationships: { project: $project }
      };
    })
  );

  def("root", () => <Thumbnails resources={$resources} project={$project} />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
