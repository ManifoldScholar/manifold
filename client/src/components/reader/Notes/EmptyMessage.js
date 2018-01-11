import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class EmptyMessage extends PureComponent {
  static displayName = "Notes.EmptyMessage";

  static propTypes = {
    annotated: PropTypes.bool
  };

  template(title, body) {
    return (
      <div className="notes-message">
        <h5 className="heading-primary">
          {title}
        </h5>
        <p>
          {body}
        </p>
      </div>
    );
  }

  renderNoResults() {
    const title = "No annotations found";
    const body = `None of your annotations match the filters set above. Adjust the filters
    to show more results.`;
    return this.template(title, body);
  }

  renderNotYetAnnotated() {
    const title = "You haven't annotated this text yet";
    const body = `Once you've highlighted or annotated a passage in this text, it will
          appear here. To annotate or highlight, select a passage from the text
          and click the appropriate button on the pop-up menu.`;
    return this.template(title, body);
  }

  render() {
    return this.props.annotated
      ? this.renderNoResults()
      : this.renderNotYetAnnotated();
  }
}
