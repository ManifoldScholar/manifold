import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { requests } from "api";
import lh from "helpers/linkHandler";

export class ContentBlockNewContainer extends Component {
  static displayName = "ContentBlock.New";

  static propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  get pendingBlock() {
    return this.location.state.pendingBlock;
  }

  handleSuccess = () => {
    const projectId = this.props.match.params.pId;
    const path = lh.link("backendProjectProjectPage", projectId);
    this.props.history.push(path);
  };

  render() {
    const pId = this.props.match.params.pId;

    return (
      <section>
        <header className="drawer-header">
          <h2 className="heading-quaternary">New Content Block</h2>
        </header>
      </section>
    );
  }
}

export default connectAndFetch(ContentBlockNewContainer);
