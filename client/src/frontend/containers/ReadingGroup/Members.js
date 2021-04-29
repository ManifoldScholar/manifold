import React, { Component } from "react";
import PropTypes from "prop-types";
import queryString from "query-string";
import { readingGroupsAPI, readingGroupMembershipsAPI, requests } from "api";
import { meta, select } from "utils/entityUtils";
import connectAndFetch from "utils/connectAndFetch";
import config from "config";
import { entityStoreActions } from "actions";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import MembersTable from "frontend/components/reading-group/Table/Members";

import withConfirmation from "hoc/with-confirmation";

const { request } = entityStoreActions;
const defaultPage = 1;
const perPage = 10;

class ReadingGroupsMembersContainer extends Component {
  static propTypes = {
    confirm: PropTypes.func.isRequired
  };

  static fetchMembers(dispatch, page, match) {
    const pagination = {
      number: page || defaultPage,
      size: perPage
    };

    const membersRequest = request(
      readingGroupsAPI.members(match.params.id, {}, pagination),
      requests.feReadingGroupMembers
    );

    const { promise: one } = dispatch(membersRequest);
    return one;
  }

  static fetchData = (getState, dispatch, location, match) => {
    const params = queryString.parse(location.search);
    const promise = ReadingGroupsMembersContainer.fetchMembers(
      dispatch,
      params.page,
      match
    );
    return Promise.all([promise]);
  };

  static mapStateToProps = state => {
    return {
      readingGroupMembers: select(
        requests.feReadingGroupMembers,
        state.entityStore
      ),
      readingGroupMembersMeta: meta(
        requests.feReadingGroupMembers,
        state.entityStore
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = this.initialState(queryString.parse(props.location.search));
  }

  initialState(init) {
    return {
      pagination: {
        number: init.page || defaultPage,
        size: perPage
      }
    };
  }

  get groupsRoute() {
    return lh.link("frontendReadingGroups");
  }

  get membersRoute() {
    lh.link("frontendReadingGroupMembers", this.props.readingGroup.id);
  }

  handlePageChange = pageParam => {
    const pagination = { ...this.state.pagination, number: pageParam };
    this.setState({ pagination }, this.doUpdate);
  };

  pageChangeHandlerCreator = pageParam => {
    return event => {
      event.preventDefault();
      this.handlePageChange(pageParam);
    };
  };

  handlePageChange = pageParam => {
    const pagination = { ...this.state.pagination, number: pageParam };
    this.setState({ pagination }, this.doUpdate);
  };

  doUpdate = () => {
    const pathname = this.props.location.pathname;
    const pageParam = this.state.pagination.number;
    const params = {};
    if (pageParam !== 1) params.page = pageParam;
    const search = queryString.stringify(params);
    this.props.history.push({ pathname, search });
    this.constructor.fetchMembers(
      this.props.dispatch,
      this.state.pagination.number,
      this.props.match
    );
  };

  pageChangeHandlerCreator = pageParam => {
    return event => {
      event.preventDefault();
      this.handlePageChange(pageParam);
    };
  };

  removeMember = readingGroupMembership => {
    const {
      heading,
      message
    } = config.app.locale.dialogs.readingGroupMembership.destroy;
    this.props.confirm(heading, message, () => {
      this.destroyMembership(readingGroupMembership);
    });
  };

  destroyMembership(readingGroupMembership) {
    const call = readingGroupMembershipsAPI.destroy(readingGroupMembership.id);
    const options = { removes: readingGroupMembership };
    const readingGroupMembershipRequest = request(
      call,
      requests.feReadingGroupMembershipDestroy,
      options
    );
    this.props.dispatch(readingGroupMembershipRequest).promise.then(() => {
      this.props.history.push(this.membersRoute);
    });
  }

  renderRoutes() {
    const { route, confirm, dispatch, readingGroup } = this.props;
    return childRoutes(route, {
      drawer: true,
      drawerProps: {
        closeUrl: this.membersRoute,
        context: "frontend",
        size: "wide",
        position: "overlay",
        lockScroll: "always"
      },
      childProps: {
        confirm,
        dispatch,
        readingGroup,
        onRemoveClick: this.removeMember,
        onEditSuccess: () => this.props.history.push(this.membersRoute)
      }
    });
  }

  render() {
    const {
      readingGroup,
      readingGroupMembers,
      readingGroupMembersMeta
    } = this.props;

    if (!readingGroupMembers) return null;

    return (
      <>
        <div className="group-page-body">
          <MembersTable
            readingGroup={readingGroup}
            members={readingGroupMembers}
            pagination={readingGroupMembersMeta.pagination}
            onPageClick={this.pageChangeHandlerCreator}
            onRemoveMember={this.removeMember}
          />
        </div>
        {this.renderRoutes()}
      </>
    );
  }
}

export default connectAndFetch(withConfirmation(ReadingGroupsMembersContainer));
