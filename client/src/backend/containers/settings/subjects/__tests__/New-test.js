import { SettingsSubjectsNewContainer } from "../New";

describe("backend/containers/settings/subjects/New", () => {
  def("root", () => <SettingsSubjectsNewContainer t={key => key} />);

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});
