import Header from "../";
import { commonActions } from "actions/helpers";

describe("Reader.Header Component", () => {
  def("text", () => factory("text"));

  def("root", () => (
    <Header
      appearance={$state.ui.persistent.reader}
      visibility={$state.ui.transitory.visibility}
      commonActions={commonActions($dispatch)}
      notifications={$state.notifications}
      text={$text}
    />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
