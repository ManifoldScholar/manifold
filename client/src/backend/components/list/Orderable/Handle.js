import React, { PureComponent } from "react";
import { SortableHandle } from "react-sortable-hoc";
import { Icon } from "components/global/SVG";

export default class ListOrderableHandle extends PureComponent {
  render() {
    const Handle = SortableHandle(() => {
      return (
        <i className="manicon drag-handle">
          <Icon.BarsDoubleHorizontal size={30} />
          <span className="screen-reader-text">
            Change the order of this list.
          </span>
        </i>
      );
    });

    return <Handle />;
  }
}
