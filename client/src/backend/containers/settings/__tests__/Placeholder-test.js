import SettingsPlaceholder from "../Placeholder";

describe("backend/containers/settings/Placeholder", () => {
  def("root", () => <SettingsPlaceholder label="All temporary stuff" />);

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});
