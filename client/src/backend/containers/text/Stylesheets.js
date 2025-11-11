import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useOutletContext, Outlet, useMatches } from "react-router-dom";
import classNames from "classnames";
import lh from "helpers/linkHandler";
import { stylesheetsAPI, requests } from "api";
import IconComposer from "global/components/utility/IconComposer";
import Stylesheet from "backend/components/stylesheet";
import withConfirmation from "hoc/withConfirmation";
import { useApiCallback } from "hooks";

function TextStylesContainer({ confirm }) {
  const { t } = useTranslation();
  const { text, refresh } = useOutletContext() || {};
  const matches = useMatches();

  const currentMatch = matches[matches.length - 1];
  const isChildRouteActive = currentMatch?.handle?.name !== "backendTextStyles";

  const destroyStylesheet = useApiCallback(stylesheetsAPI.destroy, {
    requestKey: requests.beStylesheetDestroy
  });

  const updateStylesheet = useApiCallback(stylesheetsAPI.update, {
    requestKey: requests.beStylesheetUpdate,
    notificationScope: "none"
  });

  useEffect(() => {
    if (refresh) refresh();
  }, [refresh]);

  const confirmDestroy = stylesheet => {
    const heading = t("modals.delete_text");
    const message = t("modals.delete_text_body");
    confirm(heading, message, async () => {
      await destroyStylesheet(stylesheet.id);
      if (refresh) refresh();
    });
  };

  const updatePosition = async (stylesheet, newPos, callback) => {
    const changes = {
      attributes: { position: newPos }
    };
    await updateStylesheet(stylesheet.id, changes);
    if (refresh) refresh();
    if (callback && typeof callback === "function") {
      callback();
    }
  };

  if (!text) return null;

  const stylesheets = text.relationships.stylesheets;
  const callbacks = {
    updatePosition,
    confirmDestroy
  };

  if (isChildRouteActive) {
    return <Outlet context={{ text, refresh }} />;
  }

  return (
    <section className="text-category-list-secondary">
      <div className="instructional-copy">
        <p>{t("texts.stylesheets.instructions")}</p>
      </div>

      <div
        className="entity-list__button-set-flex full-width"
        style={{ marginBlockEnd: "16px" }}
      >
        <Link
          className="entity-list__button button-lozenge-secondary"
          to={lh.link("BackendTextStylesheetNew", text.id)}
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

TextStylesContainer.displayName = "Text.Styles";

export default withConfirmation(TextStylesContainer);
