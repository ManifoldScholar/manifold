import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { pagesAPI, requests } from "api";
import { entityStoreActions } from "actions";
import connectAndFetch from "utils/connectAndFetch";
import { select } from "utils/entityUtils";
import EntitiesList, {
  Button,
  PageRow
} from "backend/components/list/EntitiesList";

const { request } = entityStoreActions;

class PagesDashboardContainer extends PureComponent {
  static displayName = "Pages.List";

  static fetchData = (getState, dispatch) => {
    const pages = request(pagesAPI.index(), requests.gPages);
    const { promise: one } = dispatch(pages);
    return Promise.all([one]);
  };

  static mapStateToProps = state => {
    return {
      pages: select(requests.gPages, state.entityStore)
    };
  };

  static propTypes = {
    pages: PropTypes.array
  };

  render() {
    const { pages } = this.props;
    if (!pages) return null;
    return (
      <EntitiesList
        entityComponent={PageRow}
        title="Manage Pages"
        titleStyle="bar"
        entities={pages}
        buttons={[
          <Button
            path={lh.link("backendRecordsPageNew")}
            type="add"
            text="Create a new page"
            authorizedFor="page"
          />
        ]}
      />
    );
  }
}

export default connectAndFetch(PagesDashboardContainer);
