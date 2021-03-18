import React, { Component } from "react";
import get from "lodash/get";
import { readingGroupsAPI, requests } from "api";
import { childRoutes } from "helpers/router";
import lh from "helpers/linkHandler";
import Authorization from "helpers/authorization";
import connectAndFetch from "utils/connectAndFetch";
import { grab } from "utils/entityUtils";
import { entityStoreActions } from "actions";
import HeadContent from "global/components/HeadContent";
import Drawer from "global/containers/drawer";
import BackLink from "frontend/components/back-link";
import Heading from "frontend/components/reading-group/Heading";
import Settings from "frontend/components/reading-group/Settings";
import SearchDialog from "frontend/components/collecting/SearchDialog";

const { request } = entityStoreActions;

class ReadingGroup extends Component {
  static fetchData = (getState, dispatch, location, match) => {
    const readingGroupFetch = readingGroupsAPI.show(match.params.id);
    const readingGroupAction = request(
      readingGroupFetch,
      requests.feReadingGroup
    );
    const { promise: one } = dispatch(readingGroupAction);
    const promises = [one];
    return Promise.all(promises);
  };

  static mapStateToProps = (state, ownProps) => {
    return {
      readingGroup: grab(
        "readingGroups",
        ownProps.match.params.id,
        state.entityStore
      ),
      readingGroupResponse: get(
        state.entityStore.responses,
        requests.feReadingGroup
      )
    };
  };

  constructor(props) {
    super(props);
    this.authorization = new Authorization();
  }

  get readingGroup() {
    return this.props.readingGroup;
  }

  get groupName() {
    return this.readingGroup.attributes.name;
  }

  get route() {
    return this.props.route;
  }

  get history() {
    return this.props.history;
  }

  get location() {
    return this.props.location;
  }

  get currentHash() {
    return this.history.location.hash;
  }

  get canUpdateGroup() {
    return this.authorization.authorizeAbility({
      entity: this.readingGroup,
      ability: "update"
    });
  }

  get showSettingsDrawer() {
    return this.currentHash === "#settings";
  }

  get showSearchDialog() {
    return this.currentHash === "#search";
  }

  get childProps() {
    const { settings, dispatch, fetchData, history } = this.props;
    return {
      settings,
      dispatch,
      fetchData,
      history,
      readingGroup: this.readingGroup
    };
  }

  get settingsProps() {
    const { dispatch, history } = this.props;
    return {
      dispatch,
      history,
      readingGroup: this.readingGroup
    };
  }

  get drawerProps() {
    return {
      open: this.showSettingsDrawer,
      context: "frontend",
      size: "wide",
      position: "overlay",
      lockScroll: "always",
      closeCallback: () => this.handleClose()
    };
  }

  handleClose() {
    const { pathname, search = "" } = this.location;
    const url = `${pathname}${search}`;
    this.history.push(url);
  }

  renderSettingsDrawer() {
    return (
      <Drawer.Wrapper {...this.drawerProps}>
        <Settings {...this.settingsProps} />
      </Drawer.Wrapper>
    );
  }

  renderSearchDialog() {
    if (!this.showSearchDialog) return null;

    return (
      <SearchDialog
        heading={this.groupName}
        onClose={() => this.handleClose()}
      />
    );
  }

  renderChildRoutes() {
    return childRoutes(this.route, {
      childProps: this.childProps
    });
  }

  render() {
    if (!this.readingGroup) return null;

    return (
      <>
        {this.renderSettingsDrawer()}
        <HeadContent title={this.groupName} appendTitle />
        <section>
          <div className="container">
            <BackLink.Register
              link={lh.link("frontendReadingGroups")}
              backText={"Manage Reading Groups"}
            />
            <Heading
              readingGroup={this.readingGroup}
              canUpdateGroup={this.canUpdateGroup}
            />
            {this.renderChildRoutes()}
            {this.renderSearchDialog()}
          </div>
        </section>
      </>
    );
  }
}

export default connectAndFetch(ReadingGroup);
