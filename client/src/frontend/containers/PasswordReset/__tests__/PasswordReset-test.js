import { PasswordResetContainer } from "../";

describe("frontend/containers/PasswordReset/PasswordReset", () => {
  def("root", () => (
    <PasswordResetContainer
      match={{
        params: {}
      }}
      history={fixtures.history()}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
