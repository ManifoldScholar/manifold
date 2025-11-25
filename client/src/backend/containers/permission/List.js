import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { permissionsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import EntitiesList, {
  Button,
  PermissionRow
} from "backend/components/list/EntitiesList";
import { useFetch } from "hooks";

export default function PermissionContainer({ entity: entityProp }) {
  const { t } = useTranslation();
  const { id: active } = useParams();
  const outletContext = useOutletContext() || {};
  const entity = entityProp || outletContext.entity;

  const { data: permissions } = useFetch({
    request: [permissionsAPI.index, entity],
    options: { requestKey: requests.bePermissions },
    condition: !!entity
  });

  if (!entity) return null;

  const listUrl = lh.nameFromType("backend", "Permission", entity);
  const newUrl = lh.nameFromType("backend", "PermissionsNew", entity);

  return (
    <section>
      {permissions && (
        <EntitiesList
          title={t("projects.permissions.header")}
          instructions={t("projects.permissions.instructions")}
          titleStyle="section"
          entities={permissions}
          entityComponent={PermissionRow}
          entityComponentProps={{
            active,
            linkName: listUrl
          }}
          buttons={[
            <Button
              path={lh.link(newUrl, entity.id)}
              text={t("projects.permissions.button_label")}
              type="add"
              authorizedTo="createPermissions"
              authorizedFor={entity}
            />
          ]}
        />
      )}
    </section>
  );
}

PermissionContainer.displayName = "PermissionContainer";
