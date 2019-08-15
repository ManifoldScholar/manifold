import React, { Component } from "react";
import MembersTable from "frontend/components/reading-group/Table/Members";
import Heading from "frontend/components/reading-group/Heading";
import { readingGroupsAPI, requests } from "api";
import { meta, select } from "utils/entityUtils";
import queryString from "query-string";
import connectAndFetch from "utils/connectAndFetch";
import BackLink from "frontend/components/back-link";
import { entityStoreActions } from "actions";
import lh from "helpers/linkHandler";

const { request } = entityStoreActions;
const defaultPage = 1;
const perPage = 20;

class ReadingGroupsMembersContainer extends Component {
  static fetchData = (getState, dispatch, location, match) => {
    const params = queryString.parse(location.search);

    const pagination = {
      number: params.page ? params.page : defaultPage,
      size: perPage
    };

    const membersRequest = request(
      readingGroupsAPI.members(match.params.id, {}, pagination),
      requests.feReadingGroupMembers
    );

    const { promise: one } = dispatch(membersRequest);

    return Promise.all([one]);
  };

  static mapStateToProps = (state, ownProps) => {
    return {
      readingGroupMembers: select(
        requests.feReadingGroupMembers,
        state.entityStore
      ),
      meta: meta(requests.feReadingGroupMembers, state.entityStore)
    };
  };

  render() {
    const { readingGroup, readingGroupMembers, meta } = this.props;
    if (!readingGroupMembers) return null;

    return (
      <React.Fragment>
        <BackLink.Register
          title={readingGroup.attributes.name}
          link={lh.link("readingGroupDetail", readingGroup.id)}
          backText={"Reading Group Details"}
        />
        <Heading subtitle="Members">{readingGroup.attributes.name}</Heading>
        <div style={{ marginTop: 50, marginBottom: 50 }}>
          <MembersTable
            readingGroup={readingGroup}
            members={readingGroupMembers}
            pagination={meta.pagination}
            onPageClick={() => console.log("Pagination clicked")}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default connectAndFetch(ReadingGroupsMembersContainer);
