import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class HighlightDetail extends PureComponent {
  static displayName = "Annotation.Highlight";

  static propTypes = {
    annotation: PropTypes.object.isRequired,
    deleteHandler: PropTypes.func
  };

  constructor() {
    super();
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete(event) {
    event.preventDefault();
    this.props.deleteHandler(this.props.annotation);
  }

  render() {
    const annotation = this.props.annotation;
    return (
      <div className="annotation-highlight-detail">
        <span className="annotation-selection">
          {annotation.attributes.subject}
        </span>

        <nav className="utility">
          <ul>
            {this.props.deleteHandler && annotation.attributes.canUpdateObject
              ? <li>
                  <button onClick={this.handleDelete}>
                    {"Delete"}
                  </button>
                </li>
              : null}
          </ul>
        </nav>
      </div>
    );
  }
}

//
