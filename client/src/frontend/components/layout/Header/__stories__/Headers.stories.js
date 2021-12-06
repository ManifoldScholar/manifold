import React from "react";
import { boolean } from "@storybook/addon-knobs";
import { storiesOf, fixtures } from "helpers/storybook/exports";
import PressHeader from "../PressHeader";
import LibraryHeader from "../LibraryHeader";
import StandaloneHeader from "../StandaloneHeader";
import { FrontendModeContext } from "helpers/contexts";
import BackLink from "frontend/components/back-link";
import { commonActions } from "actions/helpers";
import pickBy from "lodash/pickBy";
import Header from "../index";
import EntityHero from "frontend/components/composed/EntityHero";
import bookCover from "test/assets/book-cover.jpg";
import heroBackground from "test/assets/hero-bg.jpg";
import avatar from "test/assets/milton.jpg";

const projectFactory = (
  hasBg = true,
  darkMode = true,
  hasCover = true,
  hasAuthors = true
) => {
  const title = "Just another test project";
  const titleFormatted = title;
  const subtitle = "With just another subtitle";
  const subtitleFormatted = subtitle;
  const relationships = {};
  if (hasAuthors) {
    relationships.creators = [
      {
        type: "maker",
        attributes: {
          avatarStyles: {
            smallSquare: avatar
          },
          firstName: "John",
          lastName: "Milton",
          fullName: "John Milton"
        }
      }
    ];
  }

  const attributes = {
    heroStyles: {},
    coverStyles: {},
    darkMode,
    title,
    titleFormatted,
    subtitle,
    subtitleFormatted
  };
  if (hasBg) {
    attributes.heroStyles = {
      mediumLandscape: heroBackground,
      largeLandscape: heroBackground
    };
  }
  if (hasCover) {
    attributes.coverStyles = {
      medium: bookCover
    };
  }
  return fixtures.factory("project", { attributes, relationships });
};

const contextFactory = project =>
  pickBy(project.attributes, (value, key) => {
    return [
      "heroStyles",
      "darkMode",
      "title",
      "titleFormatted",
      "subtitle",
      "subtitleFormatted"
    ].includes(key);
  });

const adjustSettings = (dispatch, showPressHeader) => {
  const settings = fixtures.factory("settings");
  const baseTheme = settings.attributes.theme;
  settings.meta = { partial: false };

  if (showPressHeader) {
    settings.attributes.theme = {
      ...baseTheme,
      topBarColor: "#7B2E00",
      topBarUrl: "http://manifoldapp.org",
      topBarText: "University of Minnesota Press"
    };
  } else {
    settings.theme = baseTheme;
  }

  dispatch({
    type: "API_RESPONSE/SETTINGS",
    error: false,
    payload: {
      data: settings
    },
    meta: "settings"
  });
};

const project = projectFactory();
const contextProject = contextFactory(project);

storiesOf("Global/Headers", module)
  .add("Press Header", () => {
    return (
      <PressHeader
        bgColor={"#7B2E00"}
        url={"http://foo.com"}
        label="University of Minnesota Press"
      />
    );
  })
  .add("Library Header", () => {
    return (
      <FrontendModeContext.Provider value={{ isLibrary: true }}>
        <BackLink.Provider>
          <LibraryHeader
            authentication={{}}
            commonActions={commonActions(() => {})}
            visibility={{ uiPanels: {} }}
            location={{ pathname: "" }}
          />
        </BackLink.Provider>
      </FrontendModeContext.Provider>
    );
  })
  .add("Standalone Header", () => {
    return (
      <FrontendModeContext.Provider
        value={{
          project: contextProject,
          isLibrary: false,
          isStandalone: true
        }}
      >
        <BackLink.Provider>
          <StandaloneHeader />
        </BackLink.Provider>
      </FrontendModeContext.Provider>
    );
  });

storiesOf("Integration/Project Detail", module).add(
  "Project Detail",
  ({ dispatch }) => {
    const standalone = boolean("Standalone Mode", false);
    const showPressHeader = boolean("Press Header", false);
    const alwaysVisible = boolean("Standalone Header Always Visible", false);
    const hasBg = boolean("Project hero has bg image", true);
    const hasCover = boolean("Project hero has cover image", true);
    const darkMode = boolean("Project dark mode", true);
    const projectWithKnobs = projectFactory(hasBg, darkMode, hasCover);
    const contextProjectWithKnobs = contextFactory(projectWithKnobs);
    adjustSettings(dispatch, showPressHeader);

    return (
      <FrontendModeContext.Provider
        value={{
          project: contextProjectWithKnobs,
          isLibrary: !standalone,
          isStandalone: standalone
        }}
      >
        <BackLink.Provider>
          <Header
            authentication={{ currentUser: { attributes: { kind: "admin" } } }}
            commonActions={commonActions(() => {})}
            visibility={{ uiPanels: {} }}
            location={{ pathname: "" }}
            alwaysVisible={alwaysVisible}
          />
          <EntityHero entity={projectWithKnobs} mock />
          <div style={{ height: 600 }}>&nbsp;</div>
        </BackLink.Provider>
      </FrontendModeContext.Provider>
    );
  }
);
