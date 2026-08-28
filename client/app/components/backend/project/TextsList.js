import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useRevalidator } from "react-router";
import { textsAPI, textCategoriesAPI } from "api";
import Category from "components/backend/category";
import { cloneDeep } from "lodash-es";
import Button from "components/global/atomic/Button";
import { useApiCallback, useNotifications } from "hooks";

const BUTTON_STYLE_PROPS = {
  size: "sm",
  shape: "lozenge",
  background: "outline-accent",
  lowercase: true
};

export default function TextsList({ project, confirm, setScreenReaderStatus }) {
  const { t } = useTranslation();
  const { revalidate } = useRevalidator();
  const { addNotification } = useNotifications();

  // Text deletion is backgrounded on the API side, so the project may still
  // include the deleted text after revalidation. Remember it here so we can
  // filter it out of the list.
  const textRemovedRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [texts, setTexts] = useState([]);

  useEffect(() => {
    if (project) {
      setCategories(project.relationships.textCategories.slice(0));
      setTexts(
        project.relationships.texts.filter(
          text => text.id !== textRemovedRef.current
        )
      );
    }
  }, [project]);

  const updateCategory = useApiCallback(textCategoriesAPI.update);

  const destroyCategory = useApiCallback(textCategoriesAPI.destroy);

  const updateText = useApiCallback(textsAPI.update);

  const destroyText = useApiCallback(textsAPI.destroy);

  const handleCategoryDestroy = category => {
    confirm({
      heading: t("modals.delete_category"),
      message: t("modals.delete_category_body"),
      callback: async closeDialog => {
        await destroyCategory(category.id);
        closeDialog();
        revalidate();
      }
    });
  };

  const handleTextDestroy = (text, onConfirmed) => {
    confirm({
      heading: t("modals.delete_text"),
      message: t("modals.delete_text_body"),
      callback: async closeDialog => {
        if (onConfirmed) onConfirmed();
        await destroyText(text.id);
        textRemovedRef.current = text.id;
        closeDialog();
        revalidate();
        addNotification({
          level: 0,
          id: `TEXT_DESTROYED_${text.id}`,
          heading: t("notifications.text_delete"),
          body: t("notifications.text_delete_body", {
            title: text.attributes.titlePlaintext
          }),
          expiration: 5000
        });
      }
    });
  };

  const updateCategoryPosition = async (
    category,
    position,
    callback,
    announce
  ) => {
    const newCategories = categories.filter(c => c.id !== category.id);
    newCategories.splice(position - 1, 0, category);
    setCategories(newCategories);

    const changes = { attributes: { position } };
    await updateCategory(category.id, changes);
    revalidate();

    if (announce) {
      setScreenReaderStatus(
        t("actions.dnd.moved_to_position", {
          title: category.attributes.title,
          position
        })
      );
    }

    if (callback && typeof callback === "function") {
      callback();
    }
  };

  const updateTextCategoryAndPosition = async (
    text,
    category,
    position,
    callback,
    announce
  ) => {
    const catPayload = category
      ? { id: category.id, type: "categories" }
      : null;
    const changes = {
      relationships: { category: { data: catPayload } },
      attributes: { position }
    };

    const newTexts = texts.filter(tx => tx.id !== text.id);
    const clone = cloneDeep(texts.find(tx => tx.id === text.id));
    clone.attributes = Object.assign(clone.attributes, changes.attributes);
    clone.relationships.category = changes.relationships.category.data;
    newTexts.splice(clone.attributes.position - 1, 0, clone);
    setTexts(newTexts);

    await updateText(text.id, changes);
    revalidate();

    if (announce) {
      setScreenReaderStatus(
        t("actions.dnd.moved_to_category", {
          title: text.attributes.title,
          category: `${category?.attributes.title || "Uncategorized"}`,
          position
        })
      );
    }

    if (callback && typeof callback === "function") {
      callback();
    }
  };

  const callbacks = {
    destroyCategory: handleCategoryDestroy,
    destroyText: handleTextDestroy,
    updateCategoryPosition,
    updateTextCategoryAndPosition
  };

  return (
    <>
      <div className="entity-list__button-set-flex">
        <Button
          as={Link}
          to={`/backend/projects/${project.id}/texts/ingestions/new`}
          label={t("texts.ingest_button_label")}
          preIcon="export24"
          {...BUTTON_STYLE_PROPS}
        />
        <Button
          as={Link}
          to={`/backend/projects/${project.id}/texts/create`}
          label={t("texts.create_button_label")}
          preIcon="copy24"
          {...BUTTON_STYLE_PROPS}
        />
        <Button
          as={Link}
          to={`/backend/projects/${project.id}/texts/category/new`}
          label={t("texts.create_category_button_label")}
          preIcon="circlePlus24"
          {...BUTTON_STYLE_PROPS}
        />
      </div>

      <Category.List
        categories={categories}
        texts={texts}
        project={project}
        callbacks={callbacks}
        setScreenReaderStatus={setScreenReaderStatus}
      />
    </>
  );
}
