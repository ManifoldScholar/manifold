import { makeDecorator } from '@storybook/addons';
import Wrappers from "../wrappers";
import React from "react";
import Provider from "react-redux/es/components/Provider";
import build from "test/fixtures/build";
import storyRouter from "storybook-react-router";

const store = build.store();
const routeDecorator = storyRouter();

export default makeDecorator({
  name: 'withManifoldContext',
  parameterName: 'manifoldContext',
  wrapper: (storyFn, context, { parameters }) => {

    const wrapped = () => {
      return storyFn(
        {
          dispatch: store.dispatch
        }
      );
    };

    return (
      <Wrappers.Backend>
        <Provider store={store}>
          {routeDecorator(wrapped)}
        </Provider>
      </Wrappers.Backend>
    );
  }
});

