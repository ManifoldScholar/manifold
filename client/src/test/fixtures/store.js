import createStore from 'store/createStore';
import entity from './entity';

export default function makeStoreFixture() {

  const settings = entity.settings("0");
  const store = createStore();
  store.dispatch({
    type: 'API_RESPONSE/SETTINGS',
    error: false,
    payload: {
      data: settings
    },
    meta: "settings"
  });
  return store;

}
