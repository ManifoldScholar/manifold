import React from "react";
import { storiesOf, fixtures } from "helpers/storybook/exports";
import EntityHero from "..";
import { FrontendModeContext } from "helpers/contexts";
/* eslint-disable-next-line import/extensions */
import icon from "test/assets/icon.png";

const testProjectCallouts = [
  {
    type: "actionCallouts",
    attributes: {
      title: "Read",
      kind: "READ",
      location: "right",
      position: 1,
      url: "https://github.com/ManifoldScholar/manifold",
      externalLink: true,
      button: true
    },
    relationships: {
      project: null
    }
  },
  {
    type: "actionCallouts",
    attributes: {
      title: "Link",
      kind: "Link",
      location: "right",
      position: 1,
      url: "https://github.com/ManifoldScholar/manifold",
      externalLink: true,
      button: false
    },
    relationships: {
      project: null
    }
  }
];

const project = fixtures.collectionFactory("project", 1)[0];
const darkModeProject = {
  ...project,
  attributes: { ...project.attributes, darkMode: true },
  relationships: {
    ...project.relationships,
    actionCallouts: [
      ...project.relationships.actionCallouts,
      ...testProjectCallouts
    ]
  }
};

const testJournalCallouts = [
  {
    type: "actionCallouts",
    attributes: {
      title: "Website",
      kind: "website",
      location: "left",
      position: 1,
      url: "https://github.com/ManifoldScholar/manifold",
      externalLink: true,
      button: true
    },
    relationships: {
      project: null
    }
  },
  {
    type: "actionCallouts",
    attributes: {
      title: "Share",
      kind: "share",
      location: "left",
      position: 1,
      url: "https://github.com/ManifoldScholar/manifold",
      externalLink: true,
      button: true
    },
    relationships: {
      project: null
    }
  },
  {
    type: "actionCallouts",
    attributes: {
      title: "Email",
      kind: "email",
      location: "left",
      position: 1,
      url: "https://github.com/ManifoldScholar/manifold",
      externalLink: true,
      button: true
    },
    relationships: {
      project: null
    }
  },
  {
    type: "actionCallouts",
    attributes: {
      title: "Editorial Board",
      kind: "link",
      location: "left",
      position: 1,
      url: "https://github.com/ManifoldScholar/manifold",
      externalLink: true,
      button: false
    },
    relationships: {
      project: null
    }
  },
  {
    type: "actionCallouts",
    attributes: {
      title: "Subscription Info",
      kind: "link",
      location: "left",
      position: 1,
      url: "https://github.com/ManifoldScholar/manifold",
      externalLink: true,
      button: false
    },
    relationships: {
      project: null
    }
  }
];

const journal = fixtures.collectionFactory("journal", 1)[0];
const journalWithCallouts = {
  ...journal,
  attributes: {
    ...journal.attributes,
    mastheadColor: "#B4A075",
    logoStyles: { large: icon, medium: true }
  },
  relationships: {
    actionCallouts: testJournalCallouts
  }
};
const issue = fixtures.collectionFactory("issue", 1)[0].data;
const issueWithCallouts = {
  ...issue,
  attributes: {
    ...issue.attributes,
    mastheadColor: "#B4A075",
    logoStyles: { large: icon, medium: icon },
    avatarColor: "primary"
  },
  relationships: {
    actionCallouts: testJournalCallouts
  }
};

storiesOf("Frontend/EntityHero", module)
  .add("Project Hero", () => (
    <FrontendModeContext.Provider value={{ isStandalone: false }}>
      <EntityHero.Project entity={project} mock />
    </FrontendModeContext.Provider>
  ))
  .add("Project Hero Dark Mode", () => (
    <FrontendModeContext.Provider value={{ isStandalone: false }}>
      <EntityHero.Project entity={darkModeProject} mock />
    </FrontendModeContext.Provider>
  ))
  .add("Standalone", () => (
    <FrontendModeContext.Provider value={{ isStandalone: true }}>
      <EntityHero.Project entity={project} mock />
    </FrontendModeContext.Provider>
  ))
  .add("Journal", () => (
    <FrontendModeContext.Provider value={{ isStandalone: false }}>
      <EntityHero.Journal entity={journalWithCallouts} mock />
    </FrontendModeContext.Provider>
  ))
  .add("Issue", () => (
    <FrontendModeContext.Provider value={{ isStandalone: false }}>
      <EntityHero.Issue entity={issueWithCallouts} mock />
    </FrontendModeContext.Provider>
  ));
