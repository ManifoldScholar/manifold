import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { subjectsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import EntitiesList, {
  Button,
  SubjectRow,
} from "backend/components/list/EntitiesList";
import { useListQueryParams, useFetch } from "hooks";
import { useParams } from "react-router-dom";

export default function SettingsSubjectsListContainer({ route }) {
  const { t } = useTranslation();
  const { id } = useParams();

  const { pagination, filters } = useListQueryParams({ initSize: 10 });

  const { data: subjects, meta: subjectsMeta } = useFetch({
    request: [subjectsAPI.index, filters.current, pagination],
    options: { requestKey: requests.beSubjects },
  });

  if (!subjects || !subjectsMeta) return null;

  const drawerProps = {
    closeUrl: lh.link("backendSettingsSubjects"),
    lockScroll: "always",
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
            count: subjectsMeta?.pagination?.totalCount,
          })}
          pagination={subjectsMeta.pagination}
          showCountInHeader
          buttons={[
            <Button
              path={lh.link("backendSettingsSubjectsNew")}
              text={t("settings.subjects.add_button_label")}
              authorizedFor="subject"
              type="add"
            />,
          ]}
        />
      )}
    </>
  );
}

SettingsSubjectsListContainer.displayName = "Settings.Subjects.List";

SettingsSubjectsListContainer.propTypes = {
  route: PropTypes.object,
};
