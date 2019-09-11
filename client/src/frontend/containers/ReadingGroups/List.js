import React, { Component } from "react";
import GroupsTable from "frontend/components/reading-group/Table/Groups";
import Heading from "frontend/components/reading-group/Heading";
import JoinBox from "frontend/components/reading-group/JoinBox";
import queryString from "query-string";
import { meAPI, requests } from "api";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions } from "actions";
import { meta, select } from "utils/entityUtils";
import get from "lodash/get";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import PropTypes from "prop-types";

const { request } = entityStoreActions;

const defaultPage = 1;
const perPage = 20;

class ReadingGroupsListContainer extends Component {
  static fetchGroups(dispatch, page) {
    const pagination = {
      number: page || defaultPage,
      size: perPage
    };
    const readingGroupsFetch = meAPI.readingGroups({}, pagination);
    const readingGroupsAction = request(
      readingGroupsFetch,
      requests.feMyReadingGroups
    );
    const { promise: one } = dispatch(readingGroupsAction);
    return one;
  }

  static fetchData = (getState, dispatch, location) => {
    const search = queryString.parse(location.search);
    const promise = ReadingGroupsListContainer.fetchGroups(
      dispatch,
      search.page
    );
    return Promise.all([promise]);
  };

  static propTypes = {};

  static mapStateToProps = state => {
    return {
      readingGroups: select(requests.feMyReadingGroups, state.entityStore),
      readingGroupsMeta: meta(requests.feMyReadingGroups, state.entityStore)
    };
  };

  constructor(props) {
    super(props);
    this.state = this.initialState(queryString.parse(props.location.search));
  }

  get groups() {
    return this.props.readingGroups;
  }

  initialState(init) {
    return {
      pagination: {
        number: init.page || defaultPage,
        size: perPage
      }
    };
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

  updateUrl() {
    const pathname = this.props.location.pathname;
    const pageParam = this.state.pagination.number;
    const params = {};
    if (pageParam !== 1) params.page = pageParam;
    const search = queryString.stringify(params);
    this.props.history.push({ pathname, search });
  }

  updateResults = () => {
    this.constructor.fetchGroups(
      this.props.dispatch,
      this.state.pagination.number
    );
  };

  doUpdate() {
    this.updateResults();
    this.updateUrl();
  }

  renderRoutes() {
    const { route, settings, dispatch, fetchData } = this.props;
    const closeUrl = lh.link("frontendReadingGroups");
    return childRoutes(route, {
      drawer: true,
      drawerProps: {
        closeUrl,
        context: "frontend",
        size: "wide",
        position: "overlay",
        lockScroll: "always"
      },
      childProps: {
        settings,
        closeUrl,
        dispatch,
        fetchData
      }
    });
  }

  render() {
    if (!this.props.readingGroups) return null;
    return (
      <>
        <section>
          <div className="container">
            {this.renderRoutes()}
            <Heading
              buttons={[
                {
                  to: lh.link("frontendReadingGroupsNew"),
                  text: "Create New Reading Group"
                }
              ]}
            >
              Manage Reading Groups
            </Heading>
            <div style={{ marginTop: 50, marginBottom: 50 }}>
              <JoinBox onJoin={this.updateResults} />
            </div>
            <GroupsTable
              groups={this.groups}
              pagination={get(this.props.readingGroupsMeta, "pagination")}
              onPageClick={this.pageChangeHandlerCreator}
            />
          </div>
        </section>
      </>
    );
  }
}

export default connectAndFetch(ReadingGroupsListContainer);
