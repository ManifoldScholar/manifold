import { SettingsWrapperContainer } from "../Wrapper";

describe("backend/containers/settings/Wrapper", () => {
  beforeEach(() => {
    testHelpers.startSession($dispatch, $user);
  });
  def("user", () =>
    factory("user", {
      attributes: { abilities: { settings: { update: true } } }
    })
  );
  def("root", () => (
    <SettingsWrapperContainer route={fixtures.route()} t={key => key} />
  ));

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
