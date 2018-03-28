import React from "react";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";
import { Layout } from "components/frontend";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";

describe("Frontend.Layout.Footer component", () => {
  const settings = build.entity.settings("0");
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

});
