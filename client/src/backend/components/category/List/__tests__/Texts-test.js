import Texts from "../Texts";
import fixtures from "./__fixtures__";

describe("backend/components/category/List/Texts", () => {
  def("project", fixtures.project);

  def("root", () => (
    <Texts
      texts={$project.relationships.texts}
      callbacks={{}}
      onTextKeyboardMove={() => {}}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
