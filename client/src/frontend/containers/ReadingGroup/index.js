import React, { Component } from "react";
import get from "lodash/get";
import { readingGroupsAPI, requests } from "api";
import { childRoutes } from "helpers/router";
import lh from "helpers/linkHandler";
import connectAndFetch from "utils/connectAndFetch";
import { grab } from "utils/entityUtils";
import { entityStoreActions } from "actions";
import HeadContent from "global/components/HeadContent";
import Drawer from "global/containers/drawer";
import BackLink from "frontend/components/back-link";
import { GroupHeading } from "frontend/components/reading-group/headings";
import Settings from "frontend/components/reading-group/Settings";
import SearchDialog from "frontend/components/collecting/SearchDialog";

const { request } = entityStoreActions;

class ReadingGroup extends Component {
  static fetchData = (getState, dispatch, location, match) => {
    return Promise.all([
      ReadingGroup.fetchReadingGroup(match.params.id, dispatch)
    ]);
  };

  static fetchReadingGroup(id, dispatch) {
    const readingGroupFetch = readingGroupsAPI.show(id);
    const readingGroupAction = request(
      readingGroupFetch,
      requests.feReadingGroup
    );
    const { promise } = dispatch(readingGroupAction);
    return promise;
  }

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
    this.state = { fetchVersion: 1 };
  }

  get readingGroup() {
    return this.props.readingGroup;
  }

  get groupName() {
    return this.readingGroup.attributes.name;
  }

  get groupId() {
    return this.readingGroup.id;
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
    return this.location.hash;
  }

  get abilities() {
    return this.readingGroup.attributes.abilities;
  }

  get canUpdateGroup() {
    return this.abilities.update;
  }

  get showSettingsDrawer() {
    return this.currentHash === "#settings";
  }

  get showSearchDialog() {
    return this.currentHash === "#search";
  }

  get childProps() {
    const { settings, dispatch, history } = this.props;
    return {
      settings,
      dispatch,
      refresh: this.refreshReadingGroup,
      fetchVersion: this.state.fetchVersion,
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

  get backLinkProps() {
    if (this.readingGroup.attributes.currentUserRole === "none")
      return {
        link: lh.link("frontendPublicReadingGroups"),
        backText: "Back to: Public Reading Groups"
      };
    return {
      link: lh.link("frontendMyReadingGroups"),
      backText: "Back to: My Reading Groups"
    };
  }

  refreshReadingGroup = () => {
    const promise = ReadingGroup.fetchReadingGroup(
      this.groupId,
      this.props.dispatch
    );
    promise.then(() =>
      this.setState(prevState => {
        return {
          ...prevState,
          fetchVersion: prevState.fetchVersion + 1
        };
      })
    );
  };

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
            <BackLink.Register {...this.backLinkProps} />
            <GroupHeading
              readingGroup={this.readingGroup}
              history={this.history}
              location={this.location}
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
