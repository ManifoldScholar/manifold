import React from "react";
import PropTypes from "prop-types";
import ResponsiveImage from "../../../global/components/atomic/ResponsiveImage";
import CalloutList from "../project/Hero/CalloutList";
import Utility from "global/components/utility";
import classNames from "classnames";
import Block from "../project/Content/Block";
import Cover from "../atomic/cover";
import orderBy from "lodash/orderBy";
import Authorization from "../../../helpers/authorization";
import Credits from "../project/Hero/Credits";
import { getSrcSet } from "../../../helpers/images";
import TextList from "frontend/components/content-block/Block/types/Texts";

const IssueDetail = ({
  issue,
  dispatch,
  backgroundImage,
  blockClass = "issue-detail",
  props
}) => {
  const authorization = new Authorization();
  const authorized = authorization.authorizeAbility({
    entity: issue,
    ability: "fullyRead"
  });
  const showErrors = authorization.authorizeAbility({
    entity: issue,
    ability: "update"
  });

  const callouts = set => {
    // TODO: This needs to come from the backend

    const actionCallouts = issue.included.filter(
      el => el.type === "actionCallouts"
    );

    actionCallouts.map(ac => {
      // eslint-disable-next-line no-param-reassign
      ac.attributes.kind = "iconButton";
      const iconType = ac.attributes.button ? "share24" : "arrowRight16";
      // eslint-disable-next-line no-param-reassign
      ac.attributes.icon = { svg: iconType, size: 24 };

      return ac;
    });

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

  const metadataBlocks = issue.included.find(
    block => block.type === "metadataBlocks"
  );

  const visibilityProps = {
    showAuthors: true,
    showCategoryLabels: false,
    showDates: false,
    showDescriptions: true,
    showSubtitles: true,
    showCollectingToggle: false
  };

  const articles = issue.included.filter(block => block.type === "texts");

  return (
    <div className={blockClass}>
      <header className={`${blockClass}__banner`}>
        {backgroundImage && (
          <ResponsiveImage
            {...props}
            image={getSrcSet(
              issue.attributes,
              "avatarMeta",
              "heroStyles",
              ["medium", "large"],
              "landscape"
            )}
          />
        )}
      </header>
      <main className={`${blockClass}__main`}>
        <div className={`${blockClass}__main__title-description`}>
          <div className={`${blockClass}__main__title-row`}>
            <div className={`${blockClass}__main__title-row__title`}>
              {issue.attributes.title}
            </div>
          </div>
          <div className={`${blockClass}__main__subtitle`}>
            {issue.attributes.subtitle}
          </div>
          <div className={`${blockClass}__main__makers`}>
            <span style={{ "font-style": "italic" }}>{"by "}</span>
            <span>{issue.attributes.creatorNames}</span>
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
            <div>
              <Cover entity={issue} blockClass="issue-detail" />
            </div>
            <CalloutList
              authorized={authorized}
              blockClass={blockClass}
              callouts={callouts()}
              layoutClass={"inline"}
              showErrors={showErrors}
              visibilityClass={"desktop"}
            />
            <Credits
              wrapperClassName={`${blockClass}__right-bottom-block`}
              blockClass={blockClass}
              copy={issue.attributes.imageCreditsFormatted}
            />
          </aside>
        </div>
      </main>

      <div className={`${blockClass}__articles-info`}>
        <div className={`${blockClass}__articles`}>
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
                  <h2 className="title">Articles</h2>
                </div>
              </div>
            </header>
            <main>
              <TextList texts={articles} {...visibilityProps} />
            </main>
          </div>
        </div>
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
                <h2 className="title">Metadata</h2>
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
