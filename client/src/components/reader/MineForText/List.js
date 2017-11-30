import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { MineForText } from "components/reader";

export default class List extends PureComponent {
  static displayName = "MineForText.List";

  static propTypes = {
    annotations: PropTypes.array,
    header: PropTypes.string
  };

  render() {
    if (!this.props.annotations) return null;
    return (
      <ul className="selection-list separated">
        <div className="selection-group-heading">
          <h2>
            {this.props.header}
          </h2>
        </div>
        {this.props.annotations.map(annotation => {
          return (
            <MineForText.ListItem key={annotation.id} annotation={annotation} />
          );
        })}
      </ul>
    );
  }
}
