import EntityCount from "../EntityCount";

describe("global/components/utility/Entitycount", () => {
  def("root", () => (
    <EntityCount
      pagination={fixtures.pagination()}
      singularUnit="baby"
      pluralUnit="babies"
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
