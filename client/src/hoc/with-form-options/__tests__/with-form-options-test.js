import withFormOptions from "../";

jest.mock("global/components/form/setter", () => {
  return wrappedComponent => wrappedComponent;
});

describe("withFormOptions HOC", () => {
  class MockOptionsComponent extends React.Component {
    render() {
      return <div>A mocked component that consumes options</div>;
    }
  }

  const FormOptionsComponent = withFormOptions(MockOptionsComponent);
  const setup = (mock, options = []) => {
    const wrapper = mount(
      $withApp(<FormOptionsComponent name="foo" set={mock} options={options} />)
    );
    const child = wrapper.find(MockOptionsComponent).instance();
    return { child };
  };

  it("calls set with the correct value when options are strings and the value is a string", () => {
    const set = jest.fn();
    const { child } = setup(set, [
      { label: "foo", value: "foo" },
      { label: "bar", value: "bar" }
    ]);
    child.props.onChange({ target: { value: "bar" } });
    const setValue = set.mock.calls.pop()[0];
    expect(setValue).toEqual("bar");
  });

  it("calls set with the correct value when options are integers and the value is a string", () => {
    const set = jest.fn();
    const { child } = setup(set, [
      { label: "1", value: 1 },
      { label: "2", value: 2 }
    ]);
    child.props.onChange({ target: { value: "2" } });
    const setValue = set.mock.calls.pop()[0];
    expect(setValue).toEqual(2);
  });

  it("calls set with the correct value when options are integers and the value is an integer", () => {
    const set = jest.fn();
    const { child } = setup(set, [
      { label: "1", value: 1 },
      { label: "2", value: 2 }
    ]);
    child.props.onChange({ target: { value: 2 } });
    const setValue = set.mock.calls.pop()[0];
    expect(setValue).toEqual(2);
  });

  it("calls set with the correct value when options entities and the value is a string ID", () => {
    const set = jest.fn();
    const foo = { id: "foo" };
    const bar = { id: "bar" };
    const { child } = setup(set, [
      { label: "foo", value: foo },
      { label: "bar", value: bar }
    ]);
    child.props.onChange({ target: { value: "bar" } });
    const setValue = set.mock.calls.pop()[0];
    expect(setValue).toEqual(bar);
  });

  it("calls set with the correct value when options entities and the value is an integer ID", () => {
    const set = jest.fn();
    const foo = { id: 1 };
    const bar = { id: 2 };
    const { child } = setup(set, [
      { label: "foo", value: foo },
      { label: "bar", value: bar }
    ]);
    child.props.onChange({ target: { value: 2 } });
    const setValue = set.mock.calls.pop()[0];
    expect(setValue).toEqual(bar);
  });

  it("calls set with the correct value when options entities and the value is boolean", () => {
    const set = jest.fn();
    const { child } = setup(set, [
      { label: "foo", value: true },
      { label: "bar", value: false }
    ]);
    child.props.onChange({ target: { value: true } });
    const setValue = set.mock.calls.pop()[0];
    expect(setValue).toEqual(true);
  });

  it("calls set with the correct value when options entities and the value is string boolean", () => {
    const set = jest.fn();
    const { child } = setup(set, [
      { label: "foo", value: true },
      { label: "bar", value: false }
    ]);
    child.props.onChange({ target: { value: "true" } });
    const setValue = set.mock.calls.pop()[0];
    expect(setValue).toEqual(true);
  });
});
