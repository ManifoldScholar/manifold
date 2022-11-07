import Upload from "../Upload";

describe("global/components/form/Upload", () => {
  def("set", () => jest.fn());
  def("setOther", () => jest.fn());
  def("fakeDomEvent", () => ({
    stopPropagation: () => jest.fn(),
    preventDefault: () => jest.fn()
  }));
  def("root", () => (
    <Upload
      set={$set}
      setOther={$setOther}
      remove="attributes[avatarRemove]"
      initialValue="/some/image.jpg"
      layout="portrait"
      label="Cover"
      accepts="images"
    />
  ));
  def("wrapper", () => render($root).html());

  it("matches the snapshot", () => {
    expect($wrapper).toMatchSnapshot();
  });

  context("When there is no remove prop", () => {
    def("root", () => (
      <Upload
        set={$set}
        setOther={$setOther}
        initialValue="/some/image.jpg"
        layout="portrait"
        label="Cover"
        accepts="images"
      />
    ));

    it("matches the snapshot", () => {
      expect($wrapper).toMatchSnapshot();
    });
  });
});
