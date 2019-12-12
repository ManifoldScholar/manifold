import Secondary from "../Secondary";

describe("backend/components/navigation/Secondary", () => {
  def("links", () => [
    {
      route: "backendProjects",
      label: "projects"
    },
    {
      route: "backendRecords",
      label: "records"
    }
  ]);
  def("root", () => <Secondary links={$links} />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
