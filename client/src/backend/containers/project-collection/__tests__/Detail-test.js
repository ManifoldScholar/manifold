import { ProjectCollectionDetail } from "../Detail";

describe("backend/containers/project-collection/Detail", () => {
  def("projects", () => collectionFactory("projects"));
  def("projectCollection", () => factory("projectCollection"));
  def("collectionProjects", () => collectionFactory("collectionProject"));
  def("route", () => fixtures.route());
  def("match", () => ({ params: {} }));
  def("root", () => (
    <ProjectCollectionDetail
      projectCollection={$projectCollection}
      collectionProjects={$collectionProjects}
      dispatch={$dispatch}
      route={$route}
      match={$match}
      t={key => key}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});
