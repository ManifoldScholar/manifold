import BackLinkPrimary from "../BackLinkPrimary";

describe("frontend/components/utility/BackLinkPrimary", () => {
  def("root", () => <BackLinkPrimary link="test/link" title="test" />);
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
