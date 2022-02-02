import MainMenu from "../menus/Main";
import { ReaderContext } from "helpers/contexts";

describe("reader/components/annotation/popup/menus/Main", () => {
  def("text", () => factory("text"));
  def("root", () => (
    <ReaderContext.Provider value={$text}>
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
    </ReaderContext.Provider>
  ));

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
