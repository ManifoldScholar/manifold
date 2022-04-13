import { ProjectSocialTwitterQueriesContainer } from "../TwitterQueries";

describe("backend/containers/project/social/TwitterQueries", () => {
  def("pagination", () => fixtures.pagination());
  def("twitterQueries", () => collectionFactory("twitterQuery"));
  def("project", () => factory("project"));
  def("match", () => ({ params: { qId: "twitterQuery-2" } }));

  def("root", () => (
    <ProjectSocialTwitterQueriesContainer
      project={$project}
      dispatch={$dispatch}
      twitterQueries={$twitterQueries}
      twitterQueriesMeta={{
        pagination: $pagination
      }}
      match={$match}
      t={key => key}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});
