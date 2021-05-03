import React, { useState } from "react";
import ResponsiveImage from "../../../global/components/ResponsiveImage";
import Social from "../project/Hero/Social";
import Collecting from "frontend/components/collecting";
import Meta from "../project/Hero/Meta";
import CalloutList from "../project/Hero/CalloutList";
import orderBy from "lodash/orderBy";
import Authorization from "../../../helpers/authorization";
import abilities from "../../../test/fixtures/structures/abilities";
import metadata from "../../../test/fixtures/structures/metadata";
import Volume from "./volume/volume";
import Content from "../project/Content";

const issue = {
  id: "61d04422-fc06-4197-9525-62f33417dbc0",
  type: "projects",
  attributes: {
    abilities: { read: true },
    title: "The Gadfly",
    subtitle: null,
    subtitleFormatted: "",
    subtitlePlaintext: "",
    titleFormatted: "The Gadfly",
    titlePlaintext: "The Gadfly",
    publicationDate: null,
    createdAt: "2021-04-07T22:36:03.189Z",
    updatedAt: "2021-04-28T22:15:03.411Z",
    slug: "the-gadfly",
    avatarColor: "primary",
    avatarMeta: {
      small: { width: 213, height: 320 },
      smallSquare: { width: 320, height: 320 },
      smallLandscape: { width: 320, height: 200 },
      smallPortrait: { width: 200, height: 320 },
      medium: { width: 427, height: 640 },
      mediumSquare: { width: 640, height: 640 },
      mediumLandscape: { width: 640, height: 400 },
      mediumPortrait: { width: 400, height: 640 },
      largeLandscape: { width: 1280, height: 800 },
      original: { width: 392, height: 588 }
    },
    draft: false,
    finished: null,
    creatorNames: "Ethel Voynich",
    recentlyUpdated: true,
    updated: true,
    avatarStyles: {
      small:
        "http://localhost:3020/system/project/6/1/d/61d04422-fc06-4197-9525-62f33417dbc0/avatar/small-0a18bf038048220575e5eee1f27e1b5d.jpg",
      smallSquare:
        "http://localhost:3020/system/project/6/1/d/61d04422-fc06-4197-9525-62f33417dbc0/avatar/small_square-952872bfaf1292caf30f7be486d18ebd.jpg",
      smallLandscape:
        "http://localhost:3020/system/project/6/1/d/61d04422-fc06-4197-9525-62f33417dbc0/avatar/small_landscape-fccccd83f4a0753a0b67ea2bb84a558b.jpg",
      smallPortrait:
        "http://localhost:3020/system/project/6/1/d/61d04422-fc06-4197-9525-62f33417dbc0/avatar/small_portrait-e4d7cbddbd293db9a5f4a3bcb4043f6c.jpg",
      medium:
        "http://localhost:3020/system/project/6/1/d/61d04422-fc06-4197-9525-62f33417dbc0/avatar/medium-9b54a10640d13e0db0b24c4e9bf3a9d1.jpg",
      mediumSquare:
        "http://localhost:3020/system/project/6/1/d/61d04422-fc06-4197-9525-62f33417dbc0/avatar/medium_square-5bd1afdfba47e9c1eadb3ecb5318d790.jpg",
      mediumLandscape:
        "http://localhost:3020/system/project/6/1/d/61d04422-fc06-4197-9525-62f33417dbc0/avatar/medium_landscape-8ddaba622bc0cbbbc2017783721720cf.jpg",
      mediumPortrait:
        "http://localhost:3020/system/project/6/1/d/61d04422-fc06-4197-9525-62f33417dbc0/avatar/medium_portrait-798d541032b440ad35de1c90effd917e.jpg",
      largeLandscape:
        "http://localhost:3020/system/project/6/1/d/61d04422-fc06-4197-9525-62f33417dbc0/avatar/large_landscape-ac18ca275469b5fb8b9ecf09984c4410.jpg",
      original:
        "http://localhost:3020/system/project/6/1/d/61d04422-fc06-4197-9525-62f33417dbc0/avatar/ed55038842cd470e076b2af304c41613.jpg"
    },
    collectedByCurrentUser: false
  },
  relationships: { creators: [] },
  meta: { partial: true }
};

const JournalDetail = ({
  journal,
  blockClass = "journal-detail",
  ...props
}) => {
  // temporary
  const volumes = [];
  for (let i = 0; i < 3; i++) {
    const vol = { title: `Volume ${i + 1}`, issues: [] };
    for (let j = 0; j < 4; j++) {
      vol.issues.push(issue);
    }
    volumes.push(vol);
  }

  const [issuesLength, setIssuesLength] = useState(() => {
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
  const hasBackgroundImage = () => {
    return true;
  };
  const getSrcSet = () => {
    const attrs = journal.attributes;
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
      <header className={`${blockClass}__header`}>
        {hasBackgroundImage() && (
          <ResponsiveImage {...props} image={getSrcSet()} />
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

      <footer className={`${blockClass}__footer`}>
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
            return <Volume key={volume.id} volume={volume} />;
          })}
        </div>
        {/* <Content project={journal} /> */}
      </footer>
    </div>
  );
};

export default JournalDetail;
