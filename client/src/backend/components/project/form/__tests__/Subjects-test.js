import ProjectSubjects from "../Subjects";

describe("backend/components/project/form/Subjects", () => {
  def("subjects", () => [
    factory("subject", { id: "1" }),
    factory("subject", { id: "2" })
  ]);
  def("project", () =>
    factory("project", { relationships: { subjects: $subjects } })
  );
  def("authentication", () =>
    fixtures.authentication({ authenticated: true })
  );
  def("root", () => (
    <ProjectSubjects project={$project} authentication={$authentication} />
  ));

  it("matches the snapshot", () => {
    expect(render($withApp($root))).toMatchSnapshot();
  });
});
