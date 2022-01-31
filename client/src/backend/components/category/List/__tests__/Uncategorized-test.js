import Uncategorized from "../Uncategorized";
import fixtures from "./__fixtures__";

describe("backend/components/category/List/Uncategorized", () => {
  def("project", fixtures.project);

  def("root", () => (
    <Uncategorized
      project={$project}
      texts={$project.relationships.texts}
      callbacks={{}}
      onTextKeyboardMove={() => {}}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
