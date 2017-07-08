import React from "react";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";
import { Layout } from "components/frontend";
import { wrapWithRouter } from "test/helpers/routing";

describe("Frontend.Layout.Footer component", () => {
  const settings = {
    attributes: {
      general: {
        contactUrl: "http://www.test.com"
      }
    }
  };

  const showPage = {
    type: "pages",
    id: "1",
    attributes: {
      title: "Freestyler",
      navTitle: "Bomfunk MCs",
      slug: "bomfunk-mcs",
      showInFooter: true
    }
  };
  const hidePage = {
    type: "pages",
    id: "2",
    attributes: {
      title: "Cyclone",
      navTitle: "Dub Pistols",
      slug: "dub-pistols",
      showInFooter: false
    }
  };

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(
        <Layout.Footer
          authentication={{ authenticated: false }}
          settings={settings}
        />
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("shows page links based on show_in_footer attribute", () => {
    const component = shallow(
      <Layout.Footer
        authentication={{ authenticated: false }}
        pages={[showPage, hidePage]}
        settings={settings}
      />
    );
    expect(component.contains("Bomfunk MCs")).toBe(true);
    expect(component.contains("Dub Pistols")).toBe(false);
  });
});
