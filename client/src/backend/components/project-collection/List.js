import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import ListItem from "./ListItem";
import EntitiesList from "backend/components/list/EntitiesList";
import IconComposer from "global/components/utility/IconComposer";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export default function ProjectCollectionList(props) {
  const { t } = useTranslation();

  const {
    projectCollections,
    onCollectionSelect,
    onToggleVisibility,
    onCollectionOrderChange
  } = props ?? {};

  const { id } = useParams();

  return (
    <aside className="aside-wide project-collection-list">
      <EntitiesList
        entities={projectCollections}
        entityComponent={ListItem}
        entityComponentProps={{
          active: id,
          clickHandler: onCollectionSelect,
          visibilityToggleHandler: onToggleVisibility,
          onReorder: onCollectionOrderChange,
          itemCount: projectCollections.length
        }}
        useDragHandle
        listStyle="bare"
        callbacks={{
          onReorder: onCollectionOrderChange
        }}
      />
      <div className="actions">
        <Link
          className="button-icon-secondary button-icon-secondary--full"
          to={lh.link("backendProjectCollectionsNew")}
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

ProjectCollectionList.displayName = "ProjectCollection.List";

ProjectCollectionList.propTypes = {
  projectCollection: PropTypes.object,
  projectCollections: PropTypes.array,
  onCollectionSelect: PropTypes.func.isRequired,
  onToggleVisibility: PropTypes.func.isRequired,
  onCollectionOrderChange: PropTypes.func.isRequired,
  match: PropTypes.object
};
