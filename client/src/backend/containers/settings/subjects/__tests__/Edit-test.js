import { SettingsSubjectsEditContainer } from "../Edit";

describe("backend/containers/settings/subjects/Edit", () => {
  def("subject", () => factory("subject"));
  def("root", () => (
    <SettingsSubjectsEditContainer
      subject={$subject}
      dispatch={$dispatch}
      match={{
        params: {}
      }}
      t={key => key}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});
