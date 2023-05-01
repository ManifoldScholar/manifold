import { SettingsSubjectsListContainer } from "../List";
import { BreadcrumbsProvider } from "global/components/atomic/Breadcrumbs";

describe("backend/containers/settings/subjects/List", () => {
  def("subjects", () => collectionFactory("subject"));
  def("root", () => (
    <BreadcrumbsProvider>
      <SettingsSubjectsListContainer
        subjects={$subjects}
        subjectsMeta={{ pagination: fixtures.pagination() }}
        match={{ params: {} }}
        route={fixtures.route()}
        t={key => key}
      />
    </BreadcrumbsProvider>
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});
