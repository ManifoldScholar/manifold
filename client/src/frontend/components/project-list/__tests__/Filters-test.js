import Filters from "../Filters";

describe("frontend/components/project-list/Filters", () => {
  def("subjects", () => collectionFactory("subject"));
  def("updateAction", () => jest.fn());
  def("root", () => (
    <Filters updateAction={$updateAction} subjects={$subjects} />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
