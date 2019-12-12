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
  def("wrapper", () => mount($root));

  it("matches the snapshot", () => {
    expect($wrapper).toMatchSnapshot();
  });

  it("should contain a preview", () => {
    expect($wrapper.find('[data-id="preview"]')).toHaveLength(1);
  });

  it("should contain a remove link", () => {
    expect($wrapper.find('[data-id="remove"]')).toHaveLength(1);
  });

  it("should trigger set callback when remove is clicked", () => {
    $set.mockClear();
    $wrapper.find('[data-id="remove"]').simulate("click", $fakeDomEvent);
    expect($set).toHaveBeenCalled();
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

    it("should contain a preview", () => {
      expect($wrapper.find('[data-id="preview"]')).toHaveLength(1);
    });

    it("should contain a remove link", () => {
      expect($wrapper.find('[data-id="remove"]')).toHaveLength(1);
    });

    it("should trigger set callback when remove is clicked with null value", () => {
      $set.mockClear();
      $wrapper.find('[data-id="remove"]').simulate("click", $fakeDomEvent);
      expect($set).toHaveBeenCalled();
    });
  });
});
