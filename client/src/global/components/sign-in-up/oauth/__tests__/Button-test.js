import Button from "../Button";

describe("global/components/sign-in-up/oauth/Button", () => {
  def("settings", () => factory("settings"));
  def("root", () => (
    <Button dispatch={$dispatch} provider="twitter" settings={$settings} />
  ));
  it("matches the snapshot", () => {
    expect(shallow($withApp($root))).toMatchSnapshot();
  });
});
