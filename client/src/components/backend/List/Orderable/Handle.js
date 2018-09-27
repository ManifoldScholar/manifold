import React, { PureComponent } from "react";
import { SortableHandle } from "react-sortable-hoc";

export default class ListOrderableHandle extends PureComponent {
  render() {
    const Handle = SortableHandle(() => {
      return (
        <i className="drag-handle manicon manicon-bars-parallel-horizontal">
          <span className="screen-reader-text">
            Change the order of this list.
          </span>
        </i>
      );
    });

    return <Handle />;
  }
}
