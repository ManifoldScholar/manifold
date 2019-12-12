import { TextWrapperContainer } from "../Wrapper";

describe("backend/containers/text/Wrapper", () => {
  beforeEach(() => {
    testHelpers.startSession($dispatch, $user);
  });
  def("user", () => factory("user"));
  def("text", () =>
    factory("text", { attributes: { abilities: { update: true } } })
  );
  def("root", () => (
    <TextWrapperContainer
      text={$text}
      dispatch={$dispatch}
      route={fixtures.route()}
      match={{ params: {} }}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});
