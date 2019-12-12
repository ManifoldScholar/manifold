import Annotate from "../Annotate";

describe("reader/components/annotation/Popup/Annotate", () => {
  def("text", () => factory("text"));
  def("root", () => (
    <Annotate
      readingGroups={[]}
      showReadingGroups={jest.fn()}
      currentReadingGroup="public"
      actions={{
        openNewAnnotationDrawer: jest.fn(),
        openNewNotationDrawer: jest.fn(),
        destroyAnnotation: jest.fn(),
        showLogin: jest.fn(),
        createHighlight: jest.fn()
      }}
      showShare={() => {}}
      text={$text}
    />
  ));

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
