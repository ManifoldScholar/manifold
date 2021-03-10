import React, { Component } from "react";
import GroupSummaryBox from "frontend/components/reading-group/GroupSummaryBox";
import Heading from "frontend/components/reading-group/Heading";
import lh from "helpers/linkHandler";
import BackLink from "frontend/components/back-link";
import { readingGroupsAPI, requests } from "api";
import { meta, select } from "utils/entityUtils";
import queryString from "query-string";
import connectAndFetch from "utils/connectAndFetch";
import { entityStoreActions } from "actions";
import Annotation from "global/components/Annotation";
import { childRoutes } from "helpers/router";
import Authorization from "helpers/authorization";
import omitBy from "lodash/omitBy";
import isEmpty from "lodash/isEmpty";

const { request } = entityStoreActions;
const defaultPage = 1;
const perPage = 20;

class ReadingGroupsDetailContainer extends Component {
  static displayName = "ReadinGroups.DetailContainer";

  static fetchAnnotations = (dispatch, page, filters, match) => {
    const pagination = {
      number: page || defaultPage,
      size: perPage
    };
    const annotationsRequest = request(
      readingGroupsAPI.annotations(match.params.id, filters, pagination),
      requests.feReadingGroupAnnotations
    );
    const { promise: one } = dispatch(annotationsRequest);
    return one;
  };

  static fetchData = (getState, dispatch, location, match) => {
    const search = queryString.parse(location.search);
    const { page, ...filters } = search;
    const promise = ReadingGroupsDetailContainer.fetchAnnotations(
      dispatch,
      page,
      filters,
      match
    );

    return Promise.all([promise]);
  };

  static mapStateToProps = state => {
    return {
      annotations: select(
        requests.feReadingGroupAnnotations,
        state.entityStore
      ),
      annotationsMeta: meta(
        requests.feReadingGroupAnnotations,
        state.entityStore
      )
    };
  };

  constructor(props) {
    super(props);
    this.authorization = new Authorization();
    this.state = this.initialState(queryString.parse(props.location.search));
  }

  get isFiltered() {
    return Object.keys(omitBy(this.state.filter, isEmpty)).length > 0;
  }

  initialState(init) {
    const filter = omitBy(init, (vIgnored, k) => k === "page");

    return {
      filter: { ...filter },
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

  get hasAnnotations() {
    const { annotations } = this.props;
    return annotations && annotations.length > 0;
  }

  renderRoutes() {
    const { route, settings, dispatch, fetchData, readingGroup } = this.props;
    const closeUrl = lh.link("frontendReadingGroupDetail", readingGroup.id);
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
        fetchData,
        readingGroup
      }
    });
  }

  get readingGroup() {
    return this.props.readingGroup;
  }

  get groupName() {
    return this.readingGroup.attributes.name;
  }

  get memberships() {
    return this.readingGroup.relationships.readingGroupMemberships;
  }

  get texts() {
    return this.readingGroup.relationships.annotatedTexts;
  }

  get annotationsMeta() {
    return this.props.annotationsMeta;
  }

  get pagination() {
    return this.annotationsMeta.pagination;
  }

  get annotations() {
    return this.props.annotations;
  }

  get buttons() {
    const buttons = [];
    if (
      this.authorization.authorizeAbility({
        entity: this.readingGroup,
        ability: "update"
      })
    ) {
      buttons.push({
        to: lh.link("frontendReadingGroupEdit", this.readingGroup.id),
        text: "Edit Group"
      });
    }
    buttons.push({
      to: lh.link("frontendReadingGroupMembers", this.readingGroup.id),
      text: "See all Members"
    });
    return buttons;
  }

  filterChangeHandler = filter => {
    this.setState({ filter }, this.doUpdate);
  };

  pageChangeHandlerCreator = pageParam => {
    return event => {
      event.preventDefault();
      this.handlePageChange(pageParam);
    };
  };

  doUpdate = () => {
    const pathname = this.props.location.pathname;
    const filters = this.state.filter;
    const pageParam = this.state.pagination.number;
    const params = { ...filters };
    if (pageParam !== 1) params.page = pageParam;
    const search = queryString.stringify(params);
    this.props.history.push({ pathname, search });
    this.constructor.fetchAnnotations(
      this.props.dispatch,
      this.state.pagination.number,
      this.state.filter,
      this.props.match
    );
  };

  render() {
    if (!this.annotations || !this.readingGroup || !this.annotationsMeta)
      return null;

    return (
      <>
        {this.renderRoutes()}
        <BackLink.Register
          link={lh.link("frontendReadingGroups")}
          backText={"Manage Reading Groups"}
        />
        <Heading buttons={this.buttons}>{this.groupName}</Heading>
        <div style={{ marginTop: 50, marginBottom: 50 }}>
          <GroupSummaryBox readingGroup={this.readingGroup} />
        </div>
        <div style={{ marginTop: 50, marginBottom: 50 }}>
          <Annotation.NoteFilter
            memberships={this.memberships}
            texts={this.texts}
            updateAnnotations={this.filterChangeHandler}
            initialFilterState={this.state.filter}
            pagination={this.pagination}
          />
        </div>
        {this.hasAnnotations && (
          <Annotation.List.Default
            annotations={this.annotations}
            pagination={this.pagination}
            paginationClickHandler={this.pageChangeHandlerCreator}
          />
        )}
        {!this.hasAnnotations && (
          <Annotation.List.Placeholder isGroup isFiltered={this.isFiltered} />
        )}
      </>
    );
  }
}

export default connectAndFetch(ReadingGroupsDetailContainer);
