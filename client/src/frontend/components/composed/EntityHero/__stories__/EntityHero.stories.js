import React from "react";
import { storiesOf, fixtures } from "helpers/storybook/exports";
import EntityHero from "..";
import { FrontendModeContext } from "helpers/contexts";

const project = fixtures.collectionFactory("project", 1)[0];
const darkModeProject = {
  ...project,
  attributes: { ...project.attributes, darkMode: true }
};

storiesOf("Frontend/EntityHero", module)
  .add("Project Hero", () => (
    <FrontendModeContext.Provider value={{ isStandalone: false }}>
      <EntityHero entity={project} mock />
    </FrontendModeContext.Provider>
  ))
  .add("Project Hero Dark Mode", () => (
    <FrontendModeContext.Provider value={{ isStandalone: false }}>
      <EntityHero entity={darkModeProject} mock />
    </FrontendModeContext.Provider>
  ))
  .add("Standalone", () => (
    <FrontendModeContext.Provider value={{ isStandalone: true }}>
      <EntityHero entity={project} mock />
    </FrontendModeContext.Provider>
  ));
