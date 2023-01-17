import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
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
    pages: PropTypes.array,
    t: PropTypes.func
  };

  render() {
    const { pages, t } = this.props;
    if (!pages) return null;
    return (
      <EntitiesList
        entityComponent={PageRow}
        title={t("records.pages.header")}
        titleStyle="bar"
        entities={pages}
        buttons={[
          <Button
            path={lh.link("backendRecordsPageNew")}
            type="add"
            text={t("records.pages.button_label")}
            authorizedFor="page"
          />
        ]}
      />
    );
  }
}

export default withTranslation()(connectAndFetch(PagesDashboardContainer));
