import FieldGroup from "../FieldGroup";

describe("global/components/form/FieldGroup", () => {
  def("child", () => <div>How is babby formed?</div>);
  def("root", () => <FieldGroup children={$child} />);
  it("matches the snapshot", () => {
    expect(shallow($root)).toMatchSnapshot();
  });
});
