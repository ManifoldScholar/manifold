import React from "react";
import renderer from "react-test-renderer";
import { SettingsEmailContainer } from "../Email";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";
import entity from "test/fixtures/entity";

describe("Backend Settings Email Container", () => {
  const store = build.store();
  const settings = entity.defaults.settings;
  const isSendmail = name => "sendmail";
  const isSmtp = name => "smtp";

  describe("when delivery method is smtp", () => {
    const formMock = {
      getModelValue: isSmtp
    };

    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <SettingsEmailContainer settings={settings} form={formMock} />
        </Provider>
      )
    );

    it("renders correctly", () => {
      let tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("doesn't render to null", () => {
      let tree = component.toJSON();
      expect(tree).not.toBe(null);
    });
  });

  describe("when delivery method is sendmail", () => {
    const formMock = {
      getModelValue: isSendmail
    };

    const component = renderer.create(
      wrapWithRouter(
        <Provider store={store}>
          <SettingsEmailContainer settings={settings} form={formMock} />
        </Provider>
      )
    );

    it("renders correctly", () => {
      let tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("doesn't render to null", () => {
      let tree = component.toJSON();
      expect(tree).not.toBe(null);
    });
  });
});
