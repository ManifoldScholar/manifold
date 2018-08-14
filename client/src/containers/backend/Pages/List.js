import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Layout, Page, List } from "components/backend";
import lh from "helpers/linkHandler";
import { pagesAPI, requests } from "api";
import { entityStoreActions } from "actions";
import connectAndFetch from "utils/connectAndFetch";
import { select } from "utils/entityUtils";

const { request } = entityStoreActions;

class PagesDashboardContainer extends PureComponent {
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

  static displayName = "Pages.List";

  static propTypes = {
    pages: PropTypes.array
  };

  render() {
    const { pages } = this.props;
    return (
      <div>
        <Layout.ViewHeader>Manage Pages</Layout.ViewHeader>
        <Layout.BackendPanel>
          {pages ? (
            <List.Searchable
              newButton={{
                path: lh.link("backendRecordsPageNew"),
                text: "Create a new page",
                authorizedFor: "page"
              }}
              entities={pages}
              entityComponent={Page.ListItem}
              singularUnit="page"
              pluralUnit="pages"
            />
          ) : null}
        </Layout.BackendPanel>
      </div>
    );
  }
}

export default connectAndFetch(PagesDashboardContainer);
