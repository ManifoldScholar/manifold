import MainMenu from "../menus/Main";
import { ReaderContext } from "helpers/contexts";

describe("reader/components/annotation/popup/menus/Main", () => {
  def("text", () => factory("text"));
  def("root", () => (
    <ReaderContext.Provider value={$text}>
      <MainMenu
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
        text={$text}
        activeMenu="main"
        onKeyDown={jest.fn}
        openSubmenu={jest.fn}
        menu={{ visible: true }}
      />
    </ReaderContext.Provider>
  ));

  it("matches the snapshot when rendered", () => {
    expect(mount($withApp($root)).html()).toMatchSnapshot();
  });
});
