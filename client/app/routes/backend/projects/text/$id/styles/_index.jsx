import { useTranslation } from "react-i18next";
import { Link, useOutletContext, useRevalidator } from "react-router";
import classNames from "classnames";
import { stylesheetsAPI } from "api";
import IconComposer from "global/components/utility/IconComposer";
import Stylesheet from "components/backend/stylesheet";
import Dialog from "global/components/dialog";
import { useApiCallback } from "hooks";
import useConfirmation from "hooks/useConfirmation";

export default function TextStylesIndex() {
  const { t } = useTranslation();
  const text = useOutletContext();
  const { revalidate } = useRevalidator();
  const { confirm, confirmation } = useConfirmation();

  const destroyStylesheet = useApiCallback(stylesheetsAPI.destroy);
  const updateStylesheet = useApiCallback(stylesheetsAPI.update);

  const confirmDestroy = stylesheet => {
    confirm({
      heading: t("modals.delete_text"),
      message: t("modals.delete_text_body"),
      callback: async closeDialog => {
        await destroyStylesheet(stylesheet.id);
        closeDialog();
        revalidate();
      }
    });
  };

  const updatePosition = async (stylesheet, newPos, callback) => {
    const changes = {
      attributes: { position: newPos }
    };
    const { errors } = await updateStylesheet(stylesheet.id, changes);

    if (errors) {
      revalidate();
    }
    if (callback && typeof callback === "function") {
      callback();
    }
  };

  const stylesheets = text.relationships.stylesheets;
  const callbacks = {
    updatePosition,
    confirmDestroy
  };

  return (
    <section className="text-category-list-secondary">
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <div className="instructional-copy">
        <p>{t("texts.stylesheets.instructions")}</p>
      </div>

      <div
        className="entity-list__button-set-flex full-width"
        style={{ marginBlockEnd: "16px" }}
      >
        <Link
          className="entity-list__button button-lozenge-secondary"
          to={`/backend/projects/text/${text.id}/styles/new`}
        >
          <IconComposer
            icon="circlePlus32"
            size={18}
            className={classNames(
              "button-icon-secondary__icon",
              "button-icon-secondary__icon--large"
            )}
          />
          <span>{t("texts.stylesheets.add_button_label")}</span>
        </Link>
      </div>

      <Stylesheet.List
        stylesheets={stylesheets}
        text={text}
        callbacks={callbacks}
      />
    </section>
  );
}
