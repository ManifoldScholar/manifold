import Detail from "../Detail";
import { project } from "./__fixtures__";

describe("frontend/components/project/Detail", () => {
  def("project", () => project());

  def("root", () => <Detail dispatch={$dispatch} project={$project} />);

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});
