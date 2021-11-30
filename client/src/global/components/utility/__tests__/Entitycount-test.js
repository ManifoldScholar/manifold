import EntityCount from "../EntityCount";

describe("global/components/utility/Entitycount", () => {
  def("root", () => (
    <EntityCount pagination={fixtures.pagination()} unit="baby" />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
