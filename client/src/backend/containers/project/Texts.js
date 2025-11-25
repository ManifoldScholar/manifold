import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext, useMatches, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import withConfirmation from "hoc/withConfirmation";
import { notificationActions } from "actions";
import { textsAPI, textCategoriesAPI, requests } from "api";
import lh from "helpers/linkHandler";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import Authorize from "hoc/Authorize";
import Category from "backend/components/category";
import cloneDeep from "lodash/cloneDeep";
import classNames from "classnames";
import IconComposer from "global/components/utility/IconComposer";
import withScreenReaderStatus from "hoc/withScreenReaderStatus";
import { useApiCallback } from "hooks";

function ProjectTextsContainer({
  confirm,
  setScreenReaderStatus,
  renderLiveRegion
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { project, refresh } = useOutletContext() || {};
  const matches = useMatches();

  const [categories, setCategories] = useState([]);
  const [texts, setTexts] = useState([]);

  useEffect(() => {
    if (project) {
      setCategories(project.relationships.textCategories.slice(0));
      setTexts(project.relationships.texts.slice(0));
    }
  }, [project]);

  const updateCategory = useApiCallback(textCategoriesAPI.update, {
    requestKey: requests.beTextCategoryUpdate,
    noTouch: true,
    notificationScope: "none"
  });

  const destroyCategoryApi = useApiCallback(textCategoriesAPI.destroy, {
    requestKey: requests.beTextCategoryDestroy
  });

  const updateText = useApiCallback(textsAPI.update, {
    requestKey: requests.beTextUpdate,
    noTouch: true
  });

  const destroyTextApi = useApiCallback(textsAPI.destroy, {
    requestKey: requests.beTextDestroy
  });

  const handleCategoryDestroy = category => {
    const heading = t("modals.delete_category");
    const message = t("modals.delete_category_body");
    confirm(heading, message, async () => {
      await destroyCategoryApi(category.id);
      if (refresh) refresh();
    });
  };

  const handleTextDestroy = text => {
    const heading = t("modals.delete_text");
    const message = t("modals.delete_text_body");
    confirm(heading, message, async () => {
      await destroyTextApi(text.id);
      if (refresh) refresh();
      const notification = {
        level: 0,
        id: `TEXT_DESTROYED_${text.id}`,
        heading: t("notifications.text_delete"),
        body: t("notifications.text_delete_body", {
          title: text.attributes.titlePlaintext
        }),
        expiration: 5000
      };
      dispatch(notificationActions.addNotification(notification));
    });
  };

  const updateCategoryPosition = async (
    category,
    position,
    callback,
    announce
  ) => {
    // Optimistic update
    const newCategories = categories.filter(c => c.id !== category.id);
    newCategories.splice(position - 1, 0, category);
    setCategories(newCategories);

    const changes = { attributes: { position } };
    await updateCategory(category.id, changes);
    if (refresh) refresh();

    if (announce) {
      const announcement = t("actions.dnd.moved_to_position", {
        title: category.attributes.title,
        position
      });
      setScreenReaderStatus(announcement);
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

    // Optimistic update
    const newTexts = texts.filter(t => t.id !== text.id);
    const clone = cloneDeep(texts.find(t => t.id === text.id));
    clone.attributes = Object.assign(clone.attributes, changes.attributes);
    clone.relationships.category = changes.relationships.category.data;
    newTexts.splice(clone.attributes.position - 1, 0, clone);
    setTexts(newTexts);

    await updateText(text.id, changes);
    if (refresh) refresh();

    if (announce) {
      const announcement = t("actions.dnd.moved_to_category", {
        title: text.attributes.title,
        category: `${category?.attributes.title || "Uncategorized"}`,
        position
      });
      setScreenReaderStatus(announcement);
    }

    if (callback && typeof callback === "function") {
      callback();
    }
  };

  if (!project) return null;

  const callbacks = {
    destroyCategory: handleCategoryDestroy,
    destroyText: handleTextDestroy,
    updateCategoryPosition,
    updateTextCategoryAndPosition
  };

  const buttonClasses = classNames(
    "entity-list__button",
    "button-lozenge-secondary"
  );
  const closeUrl = lh.link("backendProjectTexts", project.id);

  const currentMatch = matches[matches.length - 1];
  const isIngestRoute = currentMatch?.handle?.ingest;

  const getDrawerProps = () => {
    if (isIngestRoute) {
      return {
        lockScroll: "always",
        wide: true,
        lockScrollClickCloses: false,
        closeUrl,
        context: "ingestion"
      };
    }
    return {
      lockScroll: "always",
      wide: true,
      lockScrollClickCloses: false,
      closeUrl
    };
  };

  return (
    <Authorize
      entity={project}
      ability="manageTexts"
      failureNotification
      failureRedirect={lh.link("backendProject", project.id)}
    >
      <>
        <OutletWithDrawer
          drawerProps={getDrawerProps()}
          context={{ project, refresh }}
        />

        <div className="entity-list__button-set-flex">
          <Link
            to={lh.link("backendProjectTextsIngestionsNew", project.id)}
            className={buttonClasses}
          >
            <span className="screen-reader-text">
              {t("texts.add_text_label")}
            </span>
            <IconComposer
              icon="export24"
              size={16}
              className={classNames(
                "button-icon-secondary__icon",
                "button-icon-secondary__icon--large"
              )}
            />
            <span className="full" aria-hidden="true">
              {t("texts.ingest_button_label")}
            </span>
          </Link>
          <Link
            to={lh.link("backendProjectTextsCreate", project.id)}
            className={buttonClasses}
          >
            <span className="screen-reader-text">
              {t("texts.create_button_label")}
            </span>
            <IconComposer
              icon="copy24"
              size={16}
              className={classNames(
                "button-icon-secondary__icon",
                "button-icon-secondary__icon--large"
              )}
            />
            <span className="full" aria-hidden="true">
              {t("texts.create_button_label")}
            </span>
          </Link>
          <Link
            to={lh.link("backendProjectCategoriesNew", project.id)}
            className={buttonClasses}
          >
            <span className="screen-reader-text">
              {t("texts.create_category_button_label")}
            </span>
            <IconComposer
              icon="circlePlus32"
              size={18}
              className={classNames(
                "button-icon-secondary__icon",
                "button-icon-secondary__icon--large"
              )}
            />
            <span className="full" aria-hidden="true">
              {t("texts.create_category_button_label")}
            </span>
          </Link>
        </div>

        <Category.List
          categories={categories}
          texts={texts}
          project={project}
          callbacks={callbacks}
          setScreenReaderStatus={setScreenReaderStatus}
        />
        {renderLiveRegion("alert")}
      </>
    </Authorize>
  );
}

ProjectTextsContainer.displayName = "Project.Texts";

export default withScreenReaderStatus(
  withConfirmation(ProjectTextsContainer),
  false
);
