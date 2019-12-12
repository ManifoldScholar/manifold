import { Annotatable } from "../Annotatable";

describe("reader/containers/annotation/Annotatable", () => {
  def("text", () => factory("text"));
  def("textSection", () => factory("textSection"));
  def("project", () => factory("project"));
  def("location", () => ({ pathname: "/read/1/section/2" }));
  def("render", () => pendingAnnotation => <div>Content</div>);
  def("root", () => (
    <Annotatable
      history={fixtures.history()}
      location={$location}
      text={$text}
      section={$textSection}
      textId={$text.id}
      projectId={$project.id}
      sectionId={$textSection.id}
      dispatch={$dispatch}
      containerSize={100}
      bodySelector={"main"}
      render={$render}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
