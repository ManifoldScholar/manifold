import { PasswordResetContainer } from "../";

describe("frontend/containers/PasswordReset/PasswordReset", () => {
  def("root", () => (
    <PasswordResetContainer
      match={{
        params: {}
      }}
      history={fixtures.history()}
      t={key => key}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
