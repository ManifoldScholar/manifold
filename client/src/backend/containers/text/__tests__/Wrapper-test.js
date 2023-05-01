import { TextWrapperContainer } from "../Wrapper";
import { BreadcrumbsProvider } from "global/components/atomic/Breadcrumbs";

describe("backend/containers/text/Wrapper", () => {
  beforeEach(() => {
    testHelpers.startSession($dispatch, $user);
  });
  def("user", () => factory("user"));
  def("text", () =>
    factory("text", { attributes: { abilities: { update: true } } })
  );
  def("root", () => (
    <BreadcrumbsProvider>
      <TextWrapperContainer
        text={$text}
        dispatch={$dispatch}
        route={fixtures.route()}
        match={{ params: {} }}
        t={key => key}
      />
    </BreadcrumbsProvider>
  ));

  it("matches the snapshot when rendered", () => {
    expect(render($withApp($root)).html()).toMatchSnapshot();
  });
});
