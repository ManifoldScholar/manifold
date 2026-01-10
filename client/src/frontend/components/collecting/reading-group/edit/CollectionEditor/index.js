import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { readingGroupsAPI, collectingAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import { CategoryNewToggle } from "./CategoryNew";
import SortableCategories from "./SortableCategories";
import { getEntityCollection } from "frontend/components/collecting/helpers";
import { useNotification } from "hooks";
import * as Styled from "./styles";

export default function CollectionEditor({
  readingGroup,
  categories,
  responses,
  refresh
}) {
  const { t } = useTranslation();

  const notifyUpdateError = useNotification(() => ({
    level: 2,
    id: "READING_GROUP_UPDATE_FAILURE",
    heading: t("notifications.reading_group_update_failure"),
    body: t("notifications.reading_group_update_failure_body"),
    expiration: 5000
  }));

  const collection = getEntityCollection(readingGroup);

  const updateCategory = useCallback(
    async category => {
      const { id: categoryId, position } = category;
      const changes = { attributes: { position } };
      try {
        await queryApi(
          readingGroupsAPI.updateCategory(readingGroup.id, categoryId, changes)
        );
      } catch (err) {
        console.error(err);
        notifyUpdateError();
        refresh();
      }
    },
    [readingGroup.id, notifyUpdateError, refresh]
  );

  const removeCategory = useCallback(
    async category => {
      try {
        await queryApi(
          readingGroupsAPI.destroyCategory(readingGroup.id, category.id)
        );
        refresh();
      } catch (err) {
        console.error(err);
        notifyUpdateError();
        refresh();
      }
    },
    [readingGroup.id, notifyUpdateError, refresh]
  );

  const updateCollectable = useCallback(
    async collectables => {
      try {
        await queryApi(collectingAPI.collect(collectables, readingGroup));
      } catch (err) {
        console.error(err);
        notifyUpdateError();
        refresh();
      }
    },
    [readingGroup, notifyUpdateError, refresh]
  );

  const removeCollectable = useCallback(
    async collectable => {
      try {
        await queryApi(collectingAPI.remove([collectable], readingGroup));
      } catch (err) {
        console.error(err);
        notifyUpdateError();
        refresh();
      }
    },
    [readingGroup, notifyUpdateError, refresh]
  );

  function onCategoryEditError(err) {
    console.error(err);
    notifyUpdateError();
    refresh();
  }

  const callbacks = {
    onCategoryDrag: updateCategory,
    onCategoryRemove: removeCategory,
    onCollectableDrag: updateCollectable,
    onCollectableRemove: removeCollectable,
    onCategoryEditError
  };

  return (
    <Styled.Editor>
      <Styled.Section>
        <Styled.Header>{t("forms.category.add_block")}</Styled.Header>
        <Styled.CategoryInputs>
          <CategoryNewToggle
            groupId={readingGroup.id}
            onError={onCategoryEditError}
            refresh={refresh}
          />
          <CategoryNewToggle
            isMarkdown
            groupId={readingGroup.id}
            onError={onCategoryEditError}
            count={categories?.length ?? 0}
            refresh={refresh}
          />
        </Styled.CategoryInputs>
      </Styled.Section>
      {categories && (
        <Styled.Section>
          <Styled.Header>{t("forms.category.organize")}</Styled.Header>
          <SortableCategories
            collection={collection}
            categories={categories}
            responses={responses}
            callbacks={callbacks}
            groupId={readingGroup.id}
          />
        </Styled.Section>
      )}
    </Styled.Editor>
  );
}

CollectionEditor.displayName = "ReadingGroup.Collecting.CollectionEditor";

CollectionEditor.propTypes = {
  readingGroup: PropTypes.object.isRequired,
  responses: PropTypes.object.isRequired,
  refresh: PropTypes.func.isRequired,
  categories: PropTypes.array
};
