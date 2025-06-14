import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { readingGroupsAPI, collectingAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { CategoryNewToggle } from "./CategoryNew";
import SortableCategories from "./SortableCategories";
import { getEntityCollection } from "frontend/components/collecting/helpers";
import { useNotification } from "hooks";
import * as Styled from "./styles";

const { request } = entityStoreActions;

export default function CollectionEditor({
  readingGroup,
  categories,
  responses,
  refresh
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const notifyUpdateError = useNotification(() => ({
    level: 2,
    id: "READING_GROUP_UPDATE_FAILURE",
    heading: t("notifications.reading_group_update_failure"),
    body: t("notifications.reading_group_update_failure_body"),
    expiration: 5000
  }));

  const collection = getEntityCollection(readingGroup);

  function updateCategory(category) {
    const { id: categoryId, position } = category;
    const changes = { attributes: { position } };
    const call = readingGroupsAPI.updateCategory(
      readingGroup.id,
      categoryId,
      changes
    );
    const updateRequest = request(call, requests.feReadingGroupCategoryUpdate);
    dispatch(updateRequest).promise.catch(err => {
      console.error(err);
      notifyUpdateError();
      refresh();
    });
  }

  function removeCategory(category) {
    const call = readingGroupsAPI.destroyCategory(readingGroup.id, category.id);
    const destroyRequest = request(
      call,
      requests.feReadingGroupCategoryDestroy
    );
    dispatch(destroyRequest)
      .promise.then(() => refresh())
      .catch(err => {
        console.error(err);
        notifyUpdateError();
        refresh();
      });
  }

  function updateCollectable(collectables) {
    const call = collectingAPI.collect(collectables, readingGroup);
    const updateRequest = request(call, requests.feCollectCollectable);
    dispatch(updateRequest).promise.catch(err => {
      console.error(err);
      notifyUpdateError();
      refresh();
    });
  }

  function removeCollectable(collectable) {
    const call = collectingAPI.remove([collectable], readingGroup);
    const updateRequest = request(call, requests.feCollectCollectable);
    dispatch(updateRequest).promise.catch(err => {
      console.error(err);
      notifyUpdateError();
      refresh();
    });
  }

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
