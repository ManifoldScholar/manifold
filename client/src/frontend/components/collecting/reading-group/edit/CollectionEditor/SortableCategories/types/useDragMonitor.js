import { useEffect, useState } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

export default function useDragMonitor(type) {
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    return monitorForElements({
      onDragStart({ source }) {
        if (source.data.type !== type) {
          return setHidden(true);
        }
        return setActive(true);
      },
      onDrop({ source }) {
        if (source.data.type !== type) {
          return setHidden(false);
        }
        return setActive(false);
      },
    });
  }, [type]);

  return { hidden, active };
}
