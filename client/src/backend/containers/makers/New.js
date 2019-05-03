import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { requests } from "api";
import lh from "helpers/linkHandler";
import Navigation from "backend/components/navigation";
import Form from "./Form";

export class MakersNewContainer extends PureComponent {
  static displayName = "Makers.New";

  static propTypes = {
    history: PropTypes.object.isRequired
  };

  handleSuccess = maker => {
    this.redirectToMaker(maker);
  };

  redirectToMaker(maker) {
    const path = lh.link("backendRecordsMaker", maker.id);
    this.props.history.push(path, { keepNotifications: true });
  }

  render() {
    return (
      <section>
        <Navigation.DrawerHeader title="New Maker" />
        <Form
          successHandler={this.handleSuccess}
          options={{ adds: requests.beMakers }}
        />
      </section>
    );
  }
}

export default connectAndFetch(MakersNewContainer);
