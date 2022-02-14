import React, { useCallback } from "react";
import { notificationActions } from "actions";
import { useDispatch } from "react-redux";

function useNotification(notificationGenerator) {
  const dispatch = useDispatch();

  const triggerNotification = useCallback(
    model => {
      const notification = notificationGenerator(model);
      dispatch(notificationActions.addNotification(notification));
    },
    [notificationGenerator, dispatch]
  );

  return triggerNotification;
}

export default useNotification;
