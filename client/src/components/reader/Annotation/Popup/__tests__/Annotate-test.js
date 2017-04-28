import React from 'react';
import renderer from 'react-test-renderer';
import Annotate from '../Annotate';
import build from 'test/fixtures/build';
import { Provider } from 'react-redux';

describe("Reader.Annotation.Popup.Annotate Component", () => {

  const store = build.store();

  // it('renders correctly when logged in', () => {
  //   const component = mount(
  //     <Provider store={store} >
  //       <Annotate
  //       />
  //     </Provider>
  //   );
  //   let tree = component.toJSON();
  //   expect(tree).toMatchSnapshot();
  // });

  it('renders correctly when not logged in', () => {
    const component = renderer.create(
      <Provider store={store} >
        <Annotate />
      </Provider>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
