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

const { request } = entityStoreActions;

const defaultPage = 1;
const perPage = 20;

class ReadingGroupsListContainer extends Component {
  static fetchData = (getState, dispatch, location) => {
    const search = queryString.parse(location.search);
    const { page, ...filters } = search;
    const pagination = {
      number: page || defaultPage,
      size: perPage
    };

    const readingGroupsFetch = meAPI.readingGroups(filters, pagination);
    const readingGroupsAction = request(
      readingGroupsFetch,
      requests.feMyReadingGroups
    );
    const { promise: one } = dispatch(readingGroupsAction);
    const promises = [one];
    return Promise.all(promises);
  };

  static mapStateToProps = state => {
    return {
      readingGroups: select(requests.feMyReadingGroups, state.entityStore),
      readingGroupsMeta: meta(requests.feMyReadingGroups, state.entityStore)
    };
  };

  constructor(props) {
    super(props);
    // this.groups = build.arrayOf.groups(8);
    this.pagination = {
      perPage: 8,
      currentPage: 3,
      nextPage: 2,
      prevPage: 0,
      totalPages: 10,
      totalCount: 32
    };
  }

  renderRoutes() {
    const { route, settings, dispatch, fetchData } = this.props;
    const closeUrl = lh.link("readingGroups");
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

  get groups() {
    return this.props.readingGroups;
  }

  pageChangeHandlerCreator = page => {
    return () => this.fetchContext(page);
  };

  render() {
    if (!this.props.readingGroups) return null;
    return (
      <React.Fragment>
        <section>
          <div className="container">
            {this.renderRoutes()}
            <Heading
              buttons={[
                {
                  to: lh.link("readingGroupsNew"),
                  text: "Create New Annotation Group"
                }
              ]}
            >
              Manage Annotation Groups
            </Heading>
            <div style={{ marginTop: 50, marginBottom: 50 }}>
              <JoinBox />
            </div>
            <GroupsTable
              groups={this.groups}
              pagination={get(this.props.readingGroupsMeta, "pagination")}
              onPageClick={this.pageChangeHandlerCreator}
            />
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default connectAndFetch(ReadingGroupsListContainer);
