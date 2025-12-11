import PropTypes from "prop-types";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import IconComposer from "components/global/utility/IconComposer";
import List from "./List";

export default function Sidebar({ projectCollections }) {
  const { t } = useTranslation();

  return (
    <aside className="aside-wide project-collection-list">
      {!!projectCollections?.length && (
        <List projectCollections={projectCollections} />
      )}
      <div className="actions">
        <Link
          className="button-icon-secondary button-icon-secondary--full"
          to="/backend/projects/project-collections/new"
        >
          <IconComposer
            icon="plus16"
            size={20}
            className={classNames(
              "button-icon-secondary__icon",
              "button-icon-secondary__icon--large"
            )}
          />
          <span>{t("project_collections.create_collection")}</span>
        </Link>
      </div>
      <p className="instructional-copy">
        {t("project_collections.create_collection_instructions")}
      </p>
    </aside>
  );
}

Sidebar.displayName = "ProjectCollection.Sidebar";

Sidebar.propTypes = {
  projectCollections: PropTypes.array
};
