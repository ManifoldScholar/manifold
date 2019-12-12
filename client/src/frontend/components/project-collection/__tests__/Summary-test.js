import Summary from "../Summary";

describe("frontend/components/project-collection/Summary", () => {
  def("project", () => factory("project"));

  def("collectionProjects", () =>
    collectionFactory("collectionProject", 3, (type, index) => {
      return {
        id: `${type}-${index}`,
        relationships: { project: $project }
      };
    })
  );

  def("projectCollection", () =>
    factory("projectCollection", {
      attributes: { projectsCount: 2 },
      relationships: { collectionProjects: $collectionProjects }
    })
  );

  def("root", () => (
    <Summary
      projectCollection={$projectCollection}
      dispatch={$dispatch}
      limit={1}
      authentication={{}}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
