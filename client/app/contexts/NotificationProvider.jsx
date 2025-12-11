import { useReducer, useCallback, useRef, useMemo } from "react";
import { v1 as uuidv1 } from "uuid";
import { NotificationContext } from "./index";

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const notification = action.payload;
      const notifications = state.notifications.slice(0);
      const index = notifications.findIndex(n => n.id === notification.id);
      if (index >= 0) {
        notifications[index] = notification;
        return { ...state, notifications };
      }
      notifications.unshift(notification);
      return { ...state, notifications };
    }
    case "REMOVE_ONE": {
      const filtered = state.notifications.filter(n => n.id !== action.payload);
      if (filtered.length === state.notifications.length) return state;
      return { ...state, notifications: filtered };
    }
    case "REMOVE_SCOPE": {
      const filtered = state.notifications.filter(
        n => n.scope !== action.payload
      );
      if (filtered.length === state.notifications.length) return state;
      return { ...state, notifications: filtered };
    }
    default:
      return state;
  }
}

const initialState = { notifications: [] };

export default function NotificationProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const timersRef = useRef({});

  const removeNotification = useCallback(id => {
    dispatch({ type: "REMOVE_ONE", payload: id });
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  }, []);

  const removeNotifications = useCallback(scope => {
    dispatch({ type: "REMOVE_SCOPE", payload: scope });
  }, []);

  const addNotification = useCallback(
    notification => {
      const n = { ...notification };
      if (!n.id) n.id = uuidv1();
      if (!n.scope) n.scope = "global";

      dispatch({ type: "ADD", payload: n });

      if (n.expiration && n.scope !== "drawer") {
        let expire = parseInt(n.expiration, 10);
        if (expire === 0) return;
        if (isNaN(expire)) expire = 5000;

        if (timersRef.current[n.id]) {
          clearTimeout(timersRef.current[n.id]);
        }
        timersRef.current[n.id] = setTimeout(() => {
          removeNotification(n.id);
        }, expire);
      }
    },
    [removeNotification]
  );

  const value = useMemo(
    () => ({
      notifications: state.notifications,
      addNotification,
      removeNotification,
      removeNotifications
    }),
    [
      state.notifications,
      addNotification,
      removeNotification,
      removeNotifications
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
