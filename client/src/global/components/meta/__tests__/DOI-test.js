import DOI from "../DOI";

describe("global/components/meta/DOI", () => {
  def("root", () => <DOI label="doi" doi="https://doi.org/10.12345.6789" />);
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
