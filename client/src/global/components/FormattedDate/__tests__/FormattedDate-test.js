import FormattedDate from "../";
import { zonedTimeToUtc } from "date-fns-tz";

describe("global/components/FormattedDate", () => {
  def("root", () => (
    <FormattedDate prefix="test" format="MMMM, yyyy" date="2017-01-01" />
  ));
  def("date", () =>
    zonedTimeToUtc("2017-01-01 13:00:00.000", "America/Los_Angeles")
  );

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
      <FormattedDate prefix="test" format="MMMM, yyyy" date={$date} />
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
    def("root", () => <FormattedDate prefix="" format="" date={$date} />);
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
