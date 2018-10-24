import notificationsReducer from "../notifications";

describe("store/reducers/notifications", () => {
  it("should return the initial state", () => {
    const state = notificationsReducer(undefined, {});
    // Must mirror initial state declared in '../notifications'
    expect(state).toEqual({
      notifications: []
    });
  });
});

describe("store/reducers/notifications", () => {
  it("Should add a new object to an empty array", () => {
    const initialState = {
      notifications: []
    };

    const action = {
      type: "ADD_NOTIFICATION",
      payload: {
        id: 1,
        level: 1,
        heading: "Warning",
        copy: "The milk has expired"
      }
    };
    const state = notificationsReducer(initialState, action);
    expect(state).toEqual({
      notifications: [
        {
          id: 1,
          level: 1,
          heading: "Warning",
          copy: "The milk has expired"
        }
      ]
    });
  });
});

describe("store/reducers/notifications", () => {
  it("should add an object to the top of an array with existing objects", () => {
    const initialState = {
      notifications: [
        {
          id: 1,
          level: 1,
          heading: "Warning",
          copy: "The milk has expired"
        }
      ]
    };

    const action = {
      type: "ADD_NOTIFICATION",
      payload: {
        id: 2,
        level: 0,
        heading: "Registration Complete"
      }
    };
    const state = notificationsReducer(initialState, action);
    expect(state).toEqual({
      notifications: [
        {
          id: 2,
          level: 0,
          heading: "Registration Complete"
        },
        {
          id: 1,
          level: 1,
          heading: "Warning",
          copy: "The milk has expired"
        }
      ]
    });
  });
});

describe("store/reducers/notifications", () => {
  it("should remove an object by its ID if it exists", () => {
    const initialState = {
      notifications: [
        {
          id: 1,
          level: 1,
          heading: "Warning",
          copy: "The milk has expired"
        },
        {
          id: 2,
          level: 0,
          heading: "Registration Complete"
        }
      ]
    };

    const action = { type: "REMOVE_NOTIFICATION", payload: 1 };
    const state = notificationsReducer(initialState, action);
    expect(state).toEqual({
      notifications: [
        {
          id: 2,
          level: 0,
          heading: "Registration Complete"
        }
      ]
    });
  });
});

describe("store/reducers/notifications", () => {
  it("should return the initial state if ID doesn't exist", () => {
    const initialState = {
      notifications: [
        {
          id: 1,
          level: 1,
          heading: "Warning",
          copy: "The milk has expired"
        },
        {
          id: 2,
          level: 0,
          heading: "Registration Complete"
        }
      ]
    };

    const action = { type: "REMOVE_NOTIFICATION", payload: 7 };
    const state = notificationsReducer(initialState, action);
    expect(state).toEqual({
      notifications: [
        {
          id: 1,
          level: 1,
          heading: "Warning",
          copy: "The milk has expired"
        },
        {
          id: 2,
          level: 0,
          heading: "Registration Complete"
        }
      ]
    });
  });
});

describe("store/reducers/notifications", () => {
  it("Should return an empty array", () => {
    const initialState = {
      notifications: [
        {
          id: 1,
          level: 1,
          heading: "Warning",
          copy: "The milk has expired"
        },
        {
          id: 2,
          level: 0,
          heading: "Registration Complete"
        }
      ]
    };

    const action = { type: "REMOVE_ALL_NOTIFICATIONS" };
    const state = notificationsReducer(initialState, action);
    expect(state).toEqual({
      notifications: []
    });
  });
});
