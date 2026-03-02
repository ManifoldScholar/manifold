import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useFetcher } from "react-router";
import { CategoryNewToggle } from "./CategoryNew";
import SortableCategories from "./SortableCategories";
import { getEntityCollection } from "frontend/components/collecting/helpers";
import { useNotifications } from "hooks";
import * as Styled from "./styles";

export default function CollectionEditor({
  readingGroup,
  categories,
  responses
}) {
  const { t } = useTranslation();
  const fetcher = useFetcher();

  const { addNotification } = useNotifications();

  useEffect(() => {
    if (fetcher.data?.errors) {
      addNotification({
        level: 2,
        id: "READING_GROUP_UPDATE_FAILURE",
        heading: t("notifications.reading_group_update_failure"),
        body: t("notifications.reading_group_update_failure_body"),
        expiration: 5000
      });
    }
  }, [fetcher.data]); // eslint-disable-line react-hooks/exhaustive-deps

  const collection = getEntityCollection(readingGroup);

  const updateCategory = category => {
    const { id: categoryId, position } = category;
    fetcher.submit(
      JSON.stringify({
        intent: "update-category-position",
        categoryId,
        position
      }),
      { method: "post", encType: "application/json" }
    );
  };

  const removeCategory = category => {
    fetcher.submit(
      JSON.stringify({ intent: "delete-category", categoryId: category.id }),
      { method: "post", encType: "application/json" }
    );
  };

  const updateCollectable = collectables => {
    fetcher.submit(
      JSON.stringify({
        intent: "update-collectables",
        collectables,
        collection: readingGroup
      }),
      { method: "post", encType: "application/json" }
    );
  };

  const removeCollectable = collectable => {
    fetcher.submit(
      JSON.stringify({
        intent: "remove-collectable",
        collectables: [collectable],
        collection: readingGroup
      }),
      { method: "post", encType: "application/json" }
    );
  };

  function onCategoryEditError(err) {
    console.error(err);
    notifyUpdateError();
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
          />
          <CategoryNewToggle
            isMarkdown
            groupId={readingGroup.id}
            onError={onCategoryEditError}
            count={categories?.length ?? 0}
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
  categories: PropTypes.array
};
