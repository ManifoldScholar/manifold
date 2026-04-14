import ReactDOM from "react-dom";
import Notifications from "global/components/Notifications";

export default function HeaderNotification(props) {
  const output = <Notifications {...props} />;
  if (import.meta.env.SSR) return output;

  const domTarget = document.getElementById("global-notification-container");
  if (domTarget) {
    return ReactDOM.createPortal(output, domTarget);
  }

  return output;
}
