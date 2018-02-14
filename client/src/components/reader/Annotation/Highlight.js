import React, { PureComponent } from "react";
import { Utility } from "components/frontend";
import PropTypes from "prop-types";

export default class HighlightDetail extends PureComponent {
  static displayName = "Annotation.Highlight";

  static propTypes = {
    annotation: PropTypes.object.isRequired,
    deleteHandler: PropTypes.func,
    visitHandler: PropTypes.func
  };

  handleDelete = event => {
    if (event) event.preventDefault();
    this.props.deleteHandler(this.props.annotation);
  };

  handleVisitHighlight = event => {
    event.preventDefault();
    this.props.visitHandler(this.props.annotation);
  };

  render() {
    const annotation = this.props.annotation;
    return (
      <div className="annotation-highlight-detail">
        <span className="annotation-selection">
          {annotation.attributes.subject}
        </span>

        <nav className="utility">
          <ul>
            {this.props.visitHandler ? (
              <li>
                <button onClick={this.handleVisitHighlight}>
                  {"View In Text"}
                </button>
              </li>
            ) : null}
            {this.props.deleteHandler &&
            annotation.attributes.canUpdateObject ? (
              <li>
                <Utility.ConfirmableButton
                  label="Delete"
                  confirmHandler={this.handleDelete}
                />
              </li>
            ) : null}
          </ul>
        </nav>
      </div>
    );
  }
}

//
