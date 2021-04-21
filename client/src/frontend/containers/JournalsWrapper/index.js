import React, { Component } from "react";
import PropTypes from "prop-types";
import { renderRoutes } from "react-router-config";
import { RedirectToFirstMatch } from "helpers/router";
import lh from "helpers/linkHandler";

export default class JournalsWrapper extends Component {
  static propTypes = {
    route: PropTypes.object
  };

  render() {
    return (
      <div>
        {/* Journals */}
        <RedirectToFirstMatch
          from={lh.link("frontendJournals")}
          candidates={[
            {
              label: "All Journals",
              route: "frontendJournalsList"
            }
          ]}
        />
        {renderRoutes(this.props.route.routes)}
      </div>
    );
  }
}
