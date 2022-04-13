import { ProjectCollectionSettings } from "../Settings";
import ProjectCollectionNew from "../New";

describe("backend/containers/project-collection/Settings", () => {
  def("projectCollection", () => factory("projectCollection"));
  def("pagination", () => fixtures.pagination());

  def("root", () => (
    <ProjectCollectionSettings
      dispatch={$dispatch}
      buildUpdateProjectCollection={jest.fn}
      projectCollection={$projectCollection}
      projectCollectionMeta={{
        relationships: { collectionProjects: $pagination }
      }}
      t={key => key}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
