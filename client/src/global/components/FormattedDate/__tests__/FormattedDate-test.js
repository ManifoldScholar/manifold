import FormattedDate from "../";
import { zonedTimeToUtc } from "date-fns-tz";
import withApp from "test/setup/withApp";

describe("global/components/FormattedDate", () => {
  def("root", () => (
    <FormattedDate prefix="test" format="PPP" date="2017-01-01" />
  ));
  def("date", () =>
    zonedTimeToUtc("2017-01-01 13:00:00.000", "America/Los_Angeles")
  );

  def("wrapper", () => mount($withApp($root)));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });

  it("formats and renders a string as date with correct prefix", () => {
    expect($wrapper.exists("time")).toBe(true);
    expect($wrapper.find("time").text()).toEqual("test January 1st, 2017");
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
    def("root", () => <FormattedDate prefix="" date={$date} />);
    it("uses a default format", () => {
      expect($wrapper.exists("time")).toBe(true);
      expect($wrapper.find("time").text()).toEqual("January 1st, 2017");
    });
  });

  context("when no date is supplied", () => {
    def("root", () => mount($withApp(<FormattedDate />)));
    it("renders nothing", () => {
      expect($root.html()).toBe("");
    });
  });
});
