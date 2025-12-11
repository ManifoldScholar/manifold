import { useContext } from "react";
import { NotificationContext } from "app/contexts";

export default function useNotifications() {
  return useContext(NotificationContext);
}
