import Debugger from "../Debugger";

describe("global/components/developer/Debugger", () => {
  def("project", () => factory("project"));
  def("root", () => <Debugger object={$project} label="Project" />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
