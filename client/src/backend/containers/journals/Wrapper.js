import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { childRoutes } from "helpers/router";
import Authorize from "hoc/Authorize";

export default function JournalsWrapper({ route }) {
  const { t } = useTranslation();
  return (
    <Authorize
      ability="update"
      entity={["journal"]}
      failureFatalError={{
        body: t("journals.unauthorized")
      }}
    >
      <div>
        <main id="skip-to-main" tabIndex={-1} className="backend-detail">
          {childRoutes(route)}
        </main>
      </div>
    </Authorize>
  );
}

JournalsWrapper.propTypes = {
  route: PropTypes.object
};
