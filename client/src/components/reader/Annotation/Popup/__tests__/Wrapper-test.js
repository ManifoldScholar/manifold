import React from 'react';
import renderer from 'react-test-renderer';
import Wrapper from '../Wrapper';
import { Provider } from 'react-redux';
import build from 'test/fixtures/build';

describe("Reader.Annotation.Popup.Wrapper Component", () => {

  const store = build.store();

  // it('renders correctly when logged in', () => {
  //   const component = renderer.create(
  //     <Provider store={store} >
  //       <Wrapper />
  //     </Provider>
  //   );
  //   let tree = component.toJSON();
  //   expect(tree).toMatchSnapshot();
  // });

  it('renders correctly when not logged in', () => {
    const component = renderer.create(
      <Provider store={store} >
        <Wrapper />
      </Provider>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
