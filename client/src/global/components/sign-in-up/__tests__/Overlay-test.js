import Overlay from "../Overlay";

describe("global/components/sign-in-up/Overlay", () => {
  def("fakeDomEvent", () => ({
    stopPropagation: () => undefined,
    preventDefault: () => undefined
  }));
  def("hideOverlayMock", () => jest.fn());
  def("user", () => factory("user"));
  def("authentication", () =>
    fixtures.authentication({ user: $user })
  );
  def("root", () => (
    <Overlay
      dispatch={$dispatch}
      visible
      settings={{}}
      hideSignInUpOverlay={$hideOverlayMock}
      authentication={$authentication}
    />
  ));
  def("wrapper", () => mount($withApp($root)));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });

  it("should trigger hideSignInUpOverlay callback when close overlay is clicked", () => {
    $hideOverlayMock.mockClear();
    $wrapper
      .find('.overlay-close')
      .first()
      .simulate("click", $fakeDomEvent);
    expect($hideOverlayMock).toHaveBeenCalled();
  });
});
