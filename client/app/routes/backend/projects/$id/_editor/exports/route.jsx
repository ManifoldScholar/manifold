import { useTranslation } from "react-i18next";
import { useFetcher, useOutletContext, useRevalidator } from "react-router";
import { isArray } from "lodash-es";
import { projectsAPI, exportTargetsAPI, projectExportationsAPI } from "api";
import loadList from "lib/react-router/loaders/loadList";
import formAction from "lib/react-router/helpers/formAction";
import { useListQueryParams, useApiCallback } from "hooks";
import EntitiesList, {
  Button,
  ProjectExportationRow
} from "components/backend/list/EntitiesList";
import Form from "components/global/form";
import Authorize from "components/hoc/Authorize";
import { StyledForm } from "./styles";

export const loader = async ({ params, request, context }) => {
  const [listData, targetsResult] = await Promise.all([
    loadList({
      request,
      context,
      fetchFn: (filters, pagination) =>
        projectsAPI.project_exportations(params.id, filters, pagination),
      options: { defaultPagination: { page: 1, perPage: 20 } }
    }),
    loadList({
      request,
      context,
      fetchFn: exportTargetsAPI.index,
      options: { skipFilters: true, skipPagination: true }
    })
  ]);
  return { ...listData, exportTargets: targetsResult.data ?? [] };
};

export const action = formAction({
  mutation: ({ data }) => projectExportationsAPI.create(data)
});

export default function ProjectExports({ loaderData }) {
  const { t } = useTranslation();
  const project = useOutletContext();
  const fetcher = useFetcher();
  const { revalidate } = useRevalidator();

  const { data: projectExportations, meta, exportTargets } = loaderData;

  useListQueryParams({ initSize: 20 });

  const deleteExportation = useApiCallback(projectExportationsAPI.destroy);

  const onDelete = async projectExportation => {
    await deleteExportation(projectExportation.id);
    revalidate();
  };

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

  const hasExportTargets = !!exportTargets?.length;

  return (
    <>
      <StyledForm
        fetcher={fetcher}
        className="form-secondary"
        model={{
          attributes: {
            project_id: project.id,
            export_target_id: ""
          }
        }}
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
                    path="/backend/settings/export-targets/new"
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
      </StyledForm>
      {hasExportTargets && (
        <div style={{ marginTop: 25 }}>
          <EntitiesList
            entityComponent={ProjectExportationRow}
            entityComponentProps={{ active: false, onDelete }}
            showCount
            indented
            pagination={meta?.pagination}
            entities={projectExportations}
            unit={t("glossary.export", {
              count: projectExportations?.length
            })}
          />
        </div>
      )}
    </>
  );
}
