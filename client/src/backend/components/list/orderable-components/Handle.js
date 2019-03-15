import React, { PureComponent } from "react";
import { SortableHandle } from "react-sortable-hoc";
import Utility from "global/components/utility";

export default class ListOrderableHandle extends PureComponent {
  render() {
    const Handle = SortableHandle(() => {
      return (
        <i className="manicon drag-handle">
          <Utility.IconComposer size={30} icon="grabber32" />
          <span className="screen-reader-text">
            Change the order of this list.
          </span>
        </i>
      );
    });

    return <Handle />;
  }
}
