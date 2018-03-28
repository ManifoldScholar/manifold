import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { People } from "containers/backend";
import { requests } from "api";
import lh from "helpers/linkHandler";

export class MakersNewContainer extends PureComponent {
  static displayName = "Makers.New";

  static propTypes = {
    history: PropTypes.object.isRequired
  };

  redirectToMaker(maker) {
    const path = lh.link("backendPeopleMaker", maker.id);
    this.props.history.push(path, { keepNotifications: true });
  }

  handleSuccess = maker => {
    this.redirectToMaker(maker);
  };

  render() {
    return (
      <section>
        <header className="drawer-header">
          <h2 className="heading-quaternary">New Maker</h2>
        </header>
        <People.Makers.Form
          successHandler={this.handleSuccess}
          options={{ adds: requests.beMakers }}
        />
      </section>
    );
  }
}

export default connectAndFetch(MakersNewContainer);
