import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { TwitterQuery } from "components/backend";
import { requests } from "api";
import lh from "helpers/linkHandler";

export class TwitterQueryNewContainer extends Component {
  static displayName = "TwitterQuery.New";

  static propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
    twitterQuery: PropTypes.object
  };

  constructor() {
    super();
    this.defaultQuery = { attributes: { active: true } };
  }

  handleSuccess = () => {
    const projectId = this.props.match.params.pId;
    const path = lh.link("backendProjectSocial", projectId);
    this.props.history.push(path);
  };

  render() {
    const pId = this.props.match.params.pId;

    return (
      <section>
        <header className="drawer-header">
          <h2 className="heading-quaternary">New Twitter Query</h2>
        </header>
        <TwitterQuery.Form
          name={requests.beTwitterQueryCreate}
          projectId={pId}
          twitterQuery={this.defaultQuery}
          successHandler={this.handleSuccess}
          notificationScope="global"
        />
      </section>
    );
  }
}

export default connectAndFetch(TwitterQueryNewContainer);
