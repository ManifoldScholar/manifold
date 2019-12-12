import Link from "../Link";

describe("backend/components/resource/form/kind/Link", () => {
  def("root", () => <Link />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
