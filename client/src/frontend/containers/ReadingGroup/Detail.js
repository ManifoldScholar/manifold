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

const { request } = entityStoreActions;
const defaultPage = 1;
const perPage = 20;

class ReadingGroupsDetailContainer extends Component {
  static fetchData = (getState, dispatch, location, match) => {
    const params = queryString.parse(location.search);

    const pagination = {
      number: params.page ? params.page : defaultPage,
      size: perPage
    };

    const annotationsRequest = request(
      readingGroupsAPI.annotations(match.params.id, {}, pagination),
      requests.feReadingGroupAnnotations
    );

    const { promise: one } = dispatch(annotationsRequest);

    return Promise.all([one]);
  };

  static mapStateToProps = state => {
    return {
      annotations: select(
        requests.feReadingGroupAnnotations,
        state.entityStore
      ),
      meta: meta(requests.feReadingGroupAnnotations, state.entityStore)
    };
  };

  render() {
    const { readingGroup, annotations, dispatch } = this.props;

    return (
      <React.Fragment>
        <BackLink.Register
          link={lh.link("readingGroups")}
          backText={"Manage Reading Groups"}
        />
        <Heading
          buttons={[
            {
              to: lh.link("readingGroupMembers", readingGroup.id),
              text: "See all Members"
            },
            {
              to: lh.link("readingGroupEdit", readingGroup.id),
              text: "Edit Group"
            }
          ]}
        >
          {readingGroup.attributes.name}
        </Heading>
        <div style={{ marginTop: 50, marginBottom: 50 }}>
          <GroupSummaryBox readingGroup={readingGroup} />
        </div>
        {annotations && (
          <Annotation.List.Default
            annotations={annotations}
            dispatch={dispatch}
          />
        )}
      </React.Fragment>
    );
  }
}

export default connectAndFetch(ReadingGroupsDetailContainer);
