import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { childRoutes } from "helpers/router";
import Authorize from "hoc/Authorize";

export default function ReadingGroupsWrapper({ route }) {
  const { t } = useTranslation();
  return (
    <Authorize
      ability="update"
      entity={["readingGroup"]}
      failureFatalError={{
        body: t("readingGroup.unauthorized"),
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

ReadingGroupsWrapper.propTypes = {
  route: PropTypes.object,
};
