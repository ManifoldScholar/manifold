import React, { useRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { subjectsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import EntitiesList, {
  Button,
  SubjectRow
} from "backend/components/list/EntitiesList";
import { usePaginationState, useSetLocation, useFetch } from "hooks";
import { useParams } from "react-router-dom";

export default function SettingsSubjectsListContainer({ route }) {
  const { t } = useTranslation();
  const { id } = useParams();

  const [pagination, setPageNumber] = usePaginationState(1, 10);

  const filters = useRef({});

  const { data: subjects, meta: subjectsMeta } = useFetch({
    request: [subjectsAPI.index, filters.current, pagination],
    options: { requestKey: requests.beSubjects }
  });

  useSetLocation({
    page: pagination.number
  });

  if (!subjects || !subjectsMeta) return null;

  const drawerProps = {
    closeUrl: lh.link("backendSettingsSubjects"),
    lockScroll: "always"
  };

  return (
    <>
      {childRoutes(route, { drawer: true, drawerProps })}
      {subjects && (
        <EntitiesList
          entityComponent={SubjectRow}
          entityComponentProps={{ active: id }}
          title={t("actions.manage_subjects")}
          titleStyle="bar"
          entities={subjects}
          unit={t("glossary.subject", {
            count: subjectsMeta?.pagination?.totalCount
          })}
          pagination={subjectsMeta.pagination}
          showCountInHeader
          callbacks={{
            onPageClick: page => e => {
              e.preventDefault();
              setPageNumber(page);
            }
          }}
          buttons={[
            <Button
              path={lh.link("backendSettingsSubjectsNew")}
              text={t("settings.subjects.add_button_label")}
              authorizedFor="subject"
              type="add"
            />
          ]}
          usesQueryParams
        />
      )}
    </>
  );
}

SettingsSubjectsListContainer.displayName = "Settings.Subjects.List";

SettingsSubjectsListContainer.propTypes = {
  route: PropTypes.object
};
