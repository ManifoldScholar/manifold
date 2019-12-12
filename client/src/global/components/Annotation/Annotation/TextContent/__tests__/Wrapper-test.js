import AnnotationSelectionWrapper from "../index";
import PropTypes from "prop-types";

describe("global/components/Annotation/Annotation/TextContent/Wrapper", () => {
  def("annotation", () => factory("annotation"));
  def("save", () => jest.fn());
  def("root", () => (
    <AnnotationSelectionWrapper selection="foo bar" annotation={$annotation} />
  ));

  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
