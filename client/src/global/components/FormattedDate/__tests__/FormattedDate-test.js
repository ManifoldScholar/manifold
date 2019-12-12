import FormattedDate from "../";

describe("global/components/FormattedDate", () => {
  def("root", () => (
    <FormattedDate prefix="test" format="MMMM, YYYY" date="01-01-2017" />
  ));
  def("wrapper", () => mount($root));

  it("matches the snapshot", () => {
    expect($wrapper).toMatchSnapshot();
  });

  it("formats and renders a string as date with correct prefix", () => {
    expect($wrapper.exists("time")).toBe(true);
    expect($wrapper.find("time").text()).toEqual("test January, 2017");
  });

  context("when the date is a date object", () => {
    def("root", () => (
      <FormattedDate
        prefix="test"
        format="MMMM, YYYY"
        date={new Date(2017, 0, 1)}
      />
    ));

    it("matches the snapshot", () => {
      expect($wrapper).toMatchSnapshot();
    });

    it("formats and renders a string as date with correct prefix", () => {
      expect($wrapper.exists("time")).toBe(true);
      expect($wrapper.find("time").text()).toEqual("test January, 2017");
    });
  });

  context("when no format is supplied", () => {
    def("root", () => (
      <FormattedDate prefix="" format="" date={new Date(2017, 0, 1)} />
    ));
    it("uses a default format", () => {
      expect($wrapper.exists("time")).toBe(true);
      expect($wrapper.find("time").text()).toEqual("January 01, 2017");
    });
  });

  context("when no date is supplied", () => {
    def("root", () => <FormattedDate prefix="" format="" date="" />);
    it("renders null", () => {
      expect($wrapper.html()).toBe(null);
    });
  });
});
