import React, { Component } from "react";
import PropTypes from "prop-types";
import Project from "frontend/components/project";
import { Redirect } from "react-router-dom";
import lh from "helpers/linkHandler";
import HeadContent from "global/components/HeadContent";
import Schema from "global/components/schema";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import Image from "../../components/project/Hero/Image";
import JournalDetail from "../../components/journal";

const JournalDetailContainer = ({
  journal,
  journalResponse,
  settings,
  dispatch,
  fetchData,
  ...props
}) => {
  const hasBackgroundImage = () => {
    return true;
  };

  if (!journalResponse) return null;
  if (journalResponse.status === 401)
    return <Redirect to={lh.link("frontend")} />;
  if (!journal) return null;

  return (
    <div>
      <CheckFrontendMode debugLabel="JournalDetail" isProjectHomePage />
      <HeadContent
        title={`\u201c${journal.attributes.titlePlaintext}\u201d on ${settings.attributes.general.installationName}`}
        description={journal.attributes.description}
      />
      <JournalDetail journal={journal} />
      <Schema.Project
        attributes={journal.attributes}
        relationships={journal.relationships}
      />
    </div>
  );
};

JournalDetailContainer.propTypes = {
  journal: PropTypes.object,
  journalResponse: PropTypes.object,
  settings: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  fetchData: PropTypes.func
};

export default JournalDetailContainer;
