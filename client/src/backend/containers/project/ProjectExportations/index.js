import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import isArray from "lodash/isArray";
import { useFetch, useListQueryParams, useApiCallback } from "hooks";
import {
  projectsAPI,
  exportTargetsAPI,
  projectExportationsAPI,
  requests
} from "api";
import EntitiesList, {
  Button,
  ProjectExportationRow
} from "backend/components/list/EntitiesList";
import Form from "/global/components/form";
import lh from "helpers/linkHandler";
import Authorize from "hoc/Authorize";
import * as Styled from "./styles";

export default function ProjectExportations({
  projectExportationsPerPage = 20
}) {
  const outletContext = useOutletContext() || {};
  const { project } = outletContext;
  const { t } = useTranslation();

  const { pagination } = useListQueryParams({
    initSize: projectExportationsPerPage
  });

  const { data: projectExportations, meta, refresh } = useFetch({
    request: [projectsAPI.project_exportations, project.id, null, pagination],
    options: { requestKey: requests.beProjectExportations }
  });

  const { data: exportTargets } = useFetch({
    request: [exportTargetsAPI.index],
    options: { requestKey: requests.beExportTargets }
  });

  const exportTargetSelectOptions = () => {
    const targets = [
      {
        label: t("projects.forms.exports.location_placeholder"),
        value: "",
        internalValue: ""
      }
    ];

    if (!isArray(exportTargets)) return targets;

    exportTargets.forEach(exportTarget =>
      targets.push({
        label: exportTarget.attributes.name,
        value: exportTarget.id,
        internalValue: exportTarget.id
      })
    );
    return targets;
  };

  const deleteExportation = useApiCallback(projectExportationsAPI.destroy, {
    refreshes: requests.beProjectExportations
  });

  const onDelete = projectExportation => {
    deleteExportation(projectExportation.id);
  };

  const active = false;

  if (!project || !projectExportations) return null;

  const hasExportTargets = !!exportTargets?.length;

  return (
    <Authorize
      entity={project}
      ability="manageProjectExportations"
      failureNotification
      failureRedirect={lh.link("backendProjects")}
    >
      <Styled.Form
        className="form-secondary"
        suppressModelErrors
        name={requests.beProjectExportationCreate}
        model={{
          attributes: {
            project_id: project.id,
            export_target_id: ""
          }
        }}
        update={() => null}
        create={projectExportationsAPI.create}
        onSuccess={refresh}
        doNotWarn
      >
        <Form.FieldGroup label="Project Exports">
          {hasExportTargets && (
            <Form.Instructions
              instructions={t("projects.forms.exports.instructions")}
            />
          )}
          {!hasExportTargets && (
            <>
              <Authorize entity="exportTarget" ability="create">
                <Form.Instructions
                  instructions={t("projects.forms.exports.no_targets")}
                />
                <div>
                  <Button
                    path={lh.link("backendSettingsExportTargetsNew")}
                    text={t("projects.forms.exports.add_target_label")}
                    type="add"
                  />
                </div>
              </Authorize>
              <Authorize
                entity="exportTarget"
                ability="create"
                successBehavior="hide"
              >
                <Form.Instructions
                  instructions={t(
                    "projects.forms.exports.no_targets_unauthorized"
                  )}
                />
              </Authorize>
            </>
          )}
          {hasExportTargets && (
            <>
              <Form.Select
                rounded
                wide
                name="attributes[export_target_id]"
                label={t("projects.forms.exports.new_export_label")}
                options={exportTargetSelectOptions()}
              />
              <Form.Errors wide names={["attributes[base]"]} />
              <Form.Save text={t("projects.forms.exports.save")} wide={false} />
            </>
          )}
        </Form.FieldGroup>
      </Styled.Form>
      {hasExportTargets && (
        <div style={{ marginTop: 25 }}>
          <EntitiesList
            entityComponent={ProjectExportationRow}
            entityComponentProps={{ active, onDelete }}
            showCount
            indented
            pagination={meta.pagination}
            entities={projectExportations}
            unit={t("glossary.export", {
              count: projectExportations?.length
            })}
          />
        </div>
      )}
    </Authorize>
  );
}

ProjectExportations.displayName = "Project.Exportations.List";
