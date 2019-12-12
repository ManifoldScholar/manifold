import { usersAPI, requests } from "api";
import onUserIsCurrentUserUpdate from "../onUserIsCurrentUserUpdate";

describe("store/subscribers/onUserIsCurrentUserUpdate", () => {
  // const user = factory("user", { attributes: { updatedAt: "1" } });
  // const updatedUser = factory("user", {
  //   attributes: {
  //     firstName: "Something",
  //     lastName: "New",
  //     fullName: "Something New",
  //     updatedAt: "2"
  //   }
  // });
  //
  // const updatedAttributes = updatedUser.attributes;
  // const initialState = {
  //   entityStore: {
  //     slugMap: {},
  //     responses: {},
  //     entities: {
  //       users: {}
  //     }
  //   },
  //   authentication: { currentUser: user }
  // };
  // initialState.entityStore.entities.users[user.id] = user;
  // initialState.entityStore.entities.users[updatedUser.id] = updatedUser;
  //
  // const buildUpdatedState = id => {
  //   const out = {
  //     entityStore: {
  //       slugMap: {},
  //       responses: {},
  //       entities: {
  //         users: {}
  //       }
  //     },
  //     authentication: { currentUser: user }
  //   };
  //   out.entityStore.entities.users[id] = {
  //     id: id,
  //     type: "users",
  //     attributes: updatedAttributes
  //   };
  //   return out;
  // };
  //
  // const mockDispatch = jest.fn();
  // const buildStore = () => {
  //   return {
  //     state: initialState,
  //     setState(state) {
  //       return (this.state = state);
  //     },
  //     getState() {
  //       return this.state;
  //     },
  //     dispatch: mockDispatch
  //   };
  // };

  xit("should not dispatch a current user update action when non-current user user is edited", () => {
    const store = buildStore();
    const subscription = onUserIsCurrentUserUpdate(store);
    store.setState(buildUpdatedState("2"));
    subscription();
    expect(mockDispatch.mock.calls).toEqual([]);
  });

  xit("should dispatch a current user update action when current user user is edited", () => {
    const store = buildStore();
    const subscription = onUserIsCurrentUserUpdate(store);
    store.setState(buildUpdatedState("1"));
    subscription();
    expect(mockDispatch.mock.calls[0][0].meta).toEqual(
      "global-authenticated-user-update"
    );
  });
});
