import React from "react";
import { SettingsIntegrationsContainer } from "../Integrations";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";
import entity from "test/fixtures/entity";
import renderer from "react-test-renderer";

describe("Backend Settings Integrations Container", () => {
  const store = build.store();
  const settings = entity.defaults.settings;

  const component = wrapWithRouter(
    <Provider store={store}>
      <SettingsIntegrationsContainer settings={settings} />
    </Provider>
  );

  it("renders correctly", () => {
    const snapshot = renderer.create(component).toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  it("doesn't render to null", () => {
    const snapshot = renderer.create(component).toJSON();
    expect(snapshot).not.toBe(null);
  });
});
