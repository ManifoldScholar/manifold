import Splash from "../Splash";

describe("frontend/components/layout/Splash", () => {
  def("clickHandleMock", () => jest.fn());
  def("feature", () => factory("feature"));
  def("root", () => (
    <Splash
      feature={$feature}
      authenticated
      toggleSignInUpOverlay={$clickHandleMock}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
