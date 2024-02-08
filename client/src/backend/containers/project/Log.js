import React, { useRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { projectsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import EntitiesList, { LogRow } from "backend/components/list/EntitiesList";
import { usePaginationState, useSetLocation, useFetch } from "hooks";

import Authorize from "hoc/Authorize";

export default function LogContainer({ project }) {
  const { t } = useTranslation();

  const [pagination, setPageNumber] = usePaginationState(1, 5);

  const filters = useRef({});

  const { data: versions, meta: versionsMeta } = useFetch({
    request: [projectsAPI.versions, project.id, filters.current, pagination],
    options: { requestKey: requests.beVersions }
  });

  useSetLocation({
    page: pagination.number
  });

  if (!versions || !versionsMeta) return null;

  return (
    <Authorize
      entity={project}
      ability="readLog"
      failureNotification
      failureRedirect={lh.link("backendProject", project.id)}
    >
      <EntitiesList
        title={t("projects.changes")}
        titleStyle="bar"
        titleTag="h2"
        titleIcon="BEActivity64"
        entities={versions}
        entityComponent={LogRow}
        pagination={versionsMeta.pagination}
        showCount
        unit={t("glossary.change", {
          count: versionsMeta?.pagination?.totalCount
        })}
        callbacks={{
          onPageClick: page => e => {
            e.preventDefault();
            setPageNumber(page);
          }
        }}
        usesQueryParams
      />
    </Authorize>
  );
}

LogContainer.displayName = "Project.Log";

LogContainer.propTypes = {
  project: PropTypes.object.isRequired
};
