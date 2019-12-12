import BackLinkSecondary from "../BackLinkSecondary";

describe("frontend/components/utility/BackLinkSecondary", () => {
  def("root", () => <BackLinkSecondary link="test/link" title="test" />);

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
