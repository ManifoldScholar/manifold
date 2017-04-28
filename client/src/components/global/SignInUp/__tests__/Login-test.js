import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import Login from '../Login';
import build from 'test/fixtures/build';
import { Provider } from 'react-redux';

describe("Global.SignInUp.Login component", () => {

  const store = build.store();

  const showForgot = jest.fn();
  const showLogin = jest.fn();
  const showCreate = jest.fn();
  const user = build.entity.user("1");

  const root = (
    <Provider store={store} >
      <Login
        dispatch={store.dispatch}
        showForgot={showForgot}
        showLogin={showLogin}
        showCreate={showCreate}
        user={user}
        authentication={{
          currentUser: user
        }}
      />
    </Provider>
  );

  it('renders correctly', () => {
    const component = renderer.create(root);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should trigger showForgot callback when show forgot is clicked', () => {
    const wrapper = mount(root);
    showForgot.mockClear();
    wrapper.find('[data-id="show-forgot"]').first().simulate('click');
    expect(showForgot).toHaveBeenCalled();
  });

  it('should trigger showCreate callback when show create is clicked', () => {
    const wrapper = mount(root);
    showCreate.mockClear();
    wrapper.find('[data-id="show-create"]').first().simulate('click');
    expect(showCreate).toHaveBeenCalled();
  });
});
