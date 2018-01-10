import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class EmptyMessage extends PureComponent {
  static displayName = "Notes.EmptyMessage";

  render() {
    return (
      <div className="notes-message">
        <h5 className="heading-primary">
          {"You haven't annotated this text yet"}
        </h5>
        <p>
          {`Once you've highlighted or annotated a passage in this text, it will
          appear here. To annotate or highlight, select a passage from the text
          and click the appropriate button on the pop-up menu.`}
        </p>
      </div>
    );
  }
}
