import React from "react";
import PropTypes from "prop-types";
import ResponsiveImage from "../../../global/components/ResponsiveImage";
import CalloutList from "../project/Hero/CalloutList";
import Utility from "global/components/utility";
import classNames from "classnames";
import Block from "../project/Content/Block";
import orderBy from "lodash/orderBy";
import Authorization from "../../../helpers/authorization";

const IssueDetail = ({
  issue,
  dispatch,
  backgroundImage,
  blockClass = "issue-detail",
  props
}) => {
  console.log(issue);
  const authorization = new Authorization();
  const authorized = authorization.authorizeAbility({
    entity: issue,
    ability: "fullyRead"
  });
  const showErrors = authorization.authorizeAbility({
    entity: issue,
    ability: "update"
  });
  console.log(backgroundImage);

  const getSrcSet = () => {
    const attrs = issue.attributes;
    return {
      renditions: [
        {
          width: attrs.avatarMeta.mediumLandscape,
          distributionUrl: attrs.heroStyles.mediumLandscape
        },
        {
          width: attrs.avatarMeta.largeLandscape,
          distributionUrl: attrs.heroStyles.largeLandscape
        }
      ]
    };
  };

  const callouts = set => {
    // TODO: This needs to come from the backend
    issue.relationships.actionCallouts.map(ac => {
      // eslint-disable-next-line no-param-reassign
      ac.attributes.kind = "iconButton";
      const iconType = ac.attributes.button ? "share24" : "arrowRight16";
      // eslint-disable-next-line no-param-reassign
      ac.attributes.icon = { svg: iconType, size: 24 };

      return ac;
    });
    const actionCallouts = issue.relationships.actionCallouts;
    if (set) {
      const filtered = actionCallouts.filter(
        callout => callout.attributes.location === set
      );
      return orderBy(
        filtered,
        ["attributes.button", "attributes.position"],
        ["desc", "asc"]
      );
    }
    return orderBy(
      actionCallouts,
      ["attributes.button", "attributes.location", "attributes.position"],
      ["desc", "asc", "asc"]
    );
  };

  const metadataBlocks = issue.relationships.contentBlocks.find(
    block => block.type === "metadataBlocks"
  );

  return (
    <div className={blockClass}>
      <header className={`${blockClass}__banner`}>
        {backgroundImage && <ResponsiveImage {...props} image={getSrcSet()} />}
      </header>
      <main className={`${blockClass}__main`}>
        <div className={`${blockClass}__main__title-description`}>
          <div className={`${blockClass}__title-row`}>
            <div className={`${blockClass}__title-row__title`}>
              {issue.attributes.title}
            </div>
          </div>
          <div
            className={`${blockClass}__main__description`}
            dangerouslySetInnerHTML={{
              __html: issue.attributes.descriptionFormatted
            }}
          />
        </div>
        <div className={`${blockClass}__main__callout-list`}>
          <aside className={`${blockClass}__callouts`}>
            <CalloutList
              authorized={authorized}
              blockClass={blockClass}
              callouts={callouts()}
              layoutClass={"inline"}
              showErrors={showErrors}
              visibilityClass={"desktop"}
            />
          </aside>
        </div>
      </main>

      <div className={`${blockClass}__articles-info`}>
        <div className={`${blockClass}__articles`}>Articles</div>
        <div className={`${blockClass}__meta`}>
          <header
            className={classNames([
              "entity-section-wrapper__heading",
              "section-heading"
            ])}
          >
            <div className="main">
              <Utility.IconComposer size={56} icon="Projects64" />
              <div className="body">
                <h2 className="title">Meta</h2>
              </div>
            </div>
          </header>
          <main>
            <Block block={metadataBlocks} project={issue} />
          </main>
        </div>
      </div>
    </div>
  );
};

IssueDetail.propTypes = {
  issue: PropTypes.object,
  blockClass: PropTypes.string
};

export default IssueDetail;
