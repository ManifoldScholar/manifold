import createStore from "store/createStore";
import factory from "../factory";

export default function store() {
  const settings = factory("settings");
  const storeInstance = createStore();
  storeInstance.dispatch({
    type: "API_RESPONSE/SETTINGS",
    error: false,
    payload: {
      data: settings
    },
    meta: "settings"
  });
  return storeInstance;
}
