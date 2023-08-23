import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import Layout from "backend/components/layout";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";
import navigation from "helpers/router/navigation";
import HeadContent from "global/components/HeadContent";

import Authorize from "hoc/Authorize";

class RecordsContainer extends PureComponent {
  static displayName = "RecordsContainer";

  static propTypes = {
    route: PropTypes.object,
    location: PropTypes.object,
    t: PropTypes.func
  };

  render() {
    const secondaryLinks = navigation.records();
    const { t } = this.props;
    const subpage = this.props.location.pathname.split("/")[3];

    return (
      <Authorize
        ability="update"
        entity={["user", "maker", "page", "feature", "exportTarget"]}
        failureFatalError={{
          body: this.props.t("records.unauthorized")
        }}
      >
        {subpage && (
          <HeadContent
            title={`${t(`titles.${subpage}`)} | ${t("common.admin")}`}
            appendDefaultTitle
          />
        )}
        <RedirectToFirstMatch
          route={"backendRecords"}
          candidates={secondaryLinks}
        />
        <div>
          <Layout.SecondaryNav links={secondaryLinks} />
          <main id="skip-to-main" tabIndex={-1} className="backend-detail">
            {childRoutes(this.props.route)}
          </main>
        </div>
      </Authorize>
    );
  }
}

export default withTranslation()(RecordsContainer);
