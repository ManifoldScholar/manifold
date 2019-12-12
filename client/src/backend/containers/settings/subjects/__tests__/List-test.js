import { SettingsSubjectsListContainer } from "../List";

describe("backend/containers/settings/subjects/List", () => {
  def("subjects", () => collectionFactory("subject"));
  def("root", () => (
    <SettingsSubjectsListContainer
      subjects={$subjects}
      subjectsMeta={{ pagination: fixtures.pagination() }}
      match={{ params: {} }}
      route={fixtures.route()}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});
