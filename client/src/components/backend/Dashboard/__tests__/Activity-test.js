import React from "react";
import renderer from "react-test-renderer";
import { Dashboard } from "components/backend";
import { createRenderer } from "react-test-renderer/shallow";
import Adapter from "enzyme-adapter-react-16";
import Enzyme from "enzyme";

Enzyme.configure({ adapter: new Adapter() });

describe("Backend.Dashboard.Activity component", () => {
  const valid_stats = {
    attributes: {
      newTextsCount: 5,
      newHighlightsCount: 4,
      newAnnotationsCount: 3,
      readerIncrease: 50,
      readersThisWeek: 2
    }
  };

  const no_google_stats = {
    attributes: {
      newTextsCount: 5,
      newHighlightsCount: 4,
      newAnnotationsCount: 3,
      readersThisWeek: null,
      readerIncrease: null
    }
  };

  it("renders correctly", () => {
    const component = renderer.create(
      <Dashboard.Activity statistics={valid_stats} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("does not render google fields when not present", () => {
    const component = Enzyme.shallow(
      <Dashboard.Activity statistics={no_google_stats} />
    );
    expect(
      component.containsMatchingElement(<td>Readers this week</td>)
    ).toEqual(false);
    expect(
      component.containsMatchingElement(<td>Change from last week</td>)
    ).toEqual(false);
  });

  it("returns null when no stats are present", () => {
    const component = createRenderer().render(<Dashboard.Activity />);
    expect(component).toBe(null);
  });
});
