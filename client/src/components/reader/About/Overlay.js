import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { About } from "components/reader";
import lh from "helpers/linkHandler";

export default class AboutOverlay extends PureComponent {
  static propTypes = {
    text: PropTypes.object,
    match: PropTypes.object,
    history: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose(eventIgnored) {
    const { textId, sectionId } = this.props.match.params;
    const closeUrl = lh.link("readerSection", textId, sectionId);
    return this.props.history.push(closeUrl);
  }

  render() {
    return (
      <div className="overlay-full-secondary bg-neutral90">
        <div onClick={this.handleClose} className="overlay-close">
          Close
          <i className="manicon manicon-x" />
        </div>
        <About.Detail text={this.props.text} handleClose={this.handleClose} />
      </div>
    );
  }
}
