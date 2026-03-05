import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { subjectsAPI } from "api";
import loadList from "app/routes/utility/loaders/loadList";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import EntitiesList, {
  Button,
  SubjectRow
} from "backend/components/list/EntitiesList";

export const loader = async ({ request, context }) => {
  return loadList({
    request,
    context,
    fetchFn: subjectsAPI.index,
    options: {
      defaultPagination: { page: 1, perPage: 10 }
    }
  });
};

export default function SettingsSubjectsLayout({ loaderData }) {
  const { t } = useTranslation();
  const { id } = useParams();

  const { data: subjects, meta } = loaderData;

  const drawerProps = {
    closeUrl: "/backend/settings/subjects",
    lockScroll: "always"
  };

  return (
    <>
      <OutletWithDrawer drawerProps={drawerProps} />
      {subjects && (
        <EntitiesList
          entityComponent={SubjectRow}
          entityComponentProps={{ active: id }}
          title={t("actions.manage_subjects")}
          titleStyle="bar"
          entities={subjects}
          unit={t("glossary.subject", {
            count: meta?.pagination?.totalCount
          })}
          pagination={meta?.pagination}
          showCountInHeader
          buttons={[
            <Button
              path="/backend/settings/subjects/new"
              text={t("settings.subjects.add_button_label")}
              authorizedFor="subject"
              type="add"
            />
          ]}
        />
      )}
    </>
  );
}
