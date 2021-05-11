import React, { useState } from "react";
import ResponsiveImage from "../../../global/components/atomic/ResponsiveImage";
import Social from "../project/Hero/Social";
import Collecting from "frontend/components/collecting";
import CalloutList from "../project/Hero/CalloutList";
import orderBy from "lodash/orderBy";
import Authorization from "../../../helpers/authorization";
import VolumeList from "../volume/list";
import Utility from "global/components/utility";
import classNames from "classnames";
import Block from "../project/Content/Block";
import issueFixture from "../../../test/fixtures/entities/issue";
import { getSrcSet } from "../../../helpers/images";

// temporary
const issue = issueFixture().data;
const volumes = [];
for (let i = 0; i < 3; i++) {
  const vol = {
    title: `Volume ${i + 1}`,
    issues: [],
    id: "61d04422-fc06-4197-9525-62f33417dbc0",
    attributes: { number: i + 1 }
  };
  for (let j = 0; j < 4; j++) {
    vol.issues.push(issue);
  }
  volumes.push(vol);
}

const JournalDetail = ({
  journal,
  blockClass = "journal-detail",
  dispatch,
  ...props
}) => {
  const [issuesLength] = useState(() => {
    let len = 0;
    volumes.forEach(vol => (len += vol.issues.length));
    return len;
  });

  const authorization = new Authorization();
  const authorized = authorization.authorizeAbility({
    entity: journal,
    ability: "fullyRead"
  });
  const showErrors = authorization.authorizeAbility({
    entity: journal,
    ability: "update"
  });

  const metadataBlocks = journal.relationships.contentBlocks.find(
    block => block.type === "metadataBlocks"
  );
  const hasBackgroundImage = () => {
    // TODO: this will be data-driven
    return true;
  };

  const callouts = set => {
    // TODO: This needs to come from the backend
    journal.relationships.actionCallouts.map(ac => {
      // eslint-disable-next-line no-param-reassign
      ac.attributes.kind = "iconButton";
      const iconType = ac.attributes.button ? "share24" : "arrowRight16";
      // eslint-disable-next-line no-param-reassign
      ac.attributes.icon = { svg: iconType, size: 24 };

      return ac;
    });
    const actionCallouts = journal.relationships.actionCallouts;
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

  return (
    <div className={blockClass}>
      <header className={`${blockClass}__banner`}>
        {hasBackgroundImage() && (
          <ResponsiveImage
            {...props}
            image={getSrcSet(
              journal.attributes,
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
          <div className={`${blockClass}__title-row`}>
            <div className={`${blockClass}__title-row__title`}>
              {journal.attributes.title}
            </div>
            <div className={`${blockClass}__title-row__collecting`}>
              <Collecting.Toggle collectable={journal} />
            </div>
          </div>
          <div
            className={`${blockClass}__main__description`}
            dangerouslySetInnerHTML={{
              __html: journal.attributes.descriptionFormatted
            }}
          />
          <div className={`${blockClass}__main__social`}>
            <Social blockClass={blockClass} project={journal} />
          </div>
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

      <div className={`${blockClass}__volumes-info`}>
        <div className={`${blockClass}__volumes`}>
          <div className={`${blockClass}__volumes__label`}>
            There are{" "}
            <span className={`${blockClass}__volumes__label--numeric`}>
              {issuesLength}
            </span>{" "}
            issues in{" "}
            <span className={`${blockClass}__volumes__label--numeric`}>
              {volumes.length}
            </span>{" "}
            volumes
          </div>
          {volumes.map(volume => {
            return (
              <VolumeList
                key={volume.id}
                volume={volume}
                authorized={authorized}
              />
            );
          })}
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
                <h2 className="title">Journal Info</h2>
              </div>
            </div>
          </header>
          <main>
            <Block block={metadataBlocks} project={journal} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default JournalDetail;
