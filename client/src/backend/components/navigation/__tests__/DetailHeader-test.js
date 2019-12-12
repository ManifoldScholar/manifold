import DetailHeader from "../DetailHeader";

describe("backend/components/navigation/DetailHeader", () => {
  def("root", () => (
    <DetailHeader
      title="Rowan"
      subtitle="World's Greatest Dog"
      type="project"
      breadcrumb={[
        {
          label: "All Projects",
          path: "/backend"
        }
      ]}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
