import React, { useCallback } from "react";
import PropTypes from "prop-types";
import Issue from "backend/components/issue";
import Navigation from "backend/components/navigation";
import { journalIssuesAPI } from "api";
import { useFetch, useApiCallback, useNotification } from "hooks";
import withConfirmation from "hoc/withConfirmation";
import lh from "helpers/linkHandler";

function ProjectIssue({ project }) {
  const { journalIssue, journal } = project.relationships;

  return <Issue.Form model={journalIssue} journalId={journal.id} />;
}

export default ProjectIssue;
