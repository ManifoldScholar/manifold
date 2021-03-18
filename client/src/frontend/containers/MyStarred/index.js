import React from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import HeadContent from "global/components/HeadContent";
import Utility from "global/components/utility";
import CollectedCount from "frontend/components/collecting/me/CollectedCount";
import {
  CollectedProjects,
  CollectedTexts,
  CollectedTextSections,
  CollectedResourceCollections,
  CollectedResources
} from "frontend/components/collecting/me/collected-blocks";
import { getEntityCollection } from "frontend/components/collecting/helpers";

import Authorize from "hoc/authorize";
import withCurrentUser from "hoc/with-current-user";

function MyStarredContainer({ currentUser }) {
  const collection = getEntityCollection(currentUser);

  return (
    <Authorize
      kind="any"
      failureRedirect={lh.link("frontendLogin")}
      failureNotification
    >
      <HeadContent title="My Starred" appendTitle />
      <section className="bg-white">
        <div className="entity-section-wrapper container">
          <header className="entity-section-wrapper__heading section-heading">
            <div className="main">
              <Utility.IconComposer
                size={48}
                icon="StarFillUnique"
                iconClass="icon-star-fill--header"
              />
              <div className="body">
                <h1 className="title">My Starred</h1>
              </div>
            </div>
          </header>
          <div className="entity-section-wrapper__details entity-section-wrapper__details--padded-top">
            <CollectedCount collection={collection} />
          </div>
          <div className="entity-section-wrapper__body">
            <CollectedProjects />
            <CollectedTexts />
            <CollectedTextSections />
            <CollectedResourceCollections />
            <CollectedResources />
          </div>
        </div>
      </section>
    </Authorize>
  );
}

MyStarredContainer.propTypes = {
  currentUser: PropTypes.object
};

export default withCurrentUser(MyStarredContainer);
