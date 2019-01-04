import React from "react";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";
import Layout from "frontend/components/layout";
import build from "test/fixtures/build";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";

const store = build.store();

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
        <Provider store={store}>
          <Layout.Footer
            authentication={{ authenticated: false }}
            settings={settings}
          />
        </Provider>
      )
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
