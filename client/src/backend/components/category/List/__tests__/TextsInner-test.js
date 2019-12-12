import TextsInner from "../TextsInner";
import fixtures from "./__fixtures__";

describe("backend/components/category/List/TextsInner", () => {
  def("project", fixtures.project);

  def("root", () => (
    <TextsInner texts={$project.relationships.texts} callbacks={{}} />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
