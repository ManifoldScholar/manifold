import { useTranslation } from "react-i18next";
import truncate from "lodash/truncate";
import classNames from "classnames";
import IconComposer from "global/components/utility/IconComposer";

const Property = ({ label, value }) => (
  <div className="ingestion-output__item">
    <p className="ingestion-output__label">{label}</p>
    <p className="ingestion-output__value">{value}</p>
  </div>
);

export default function IngestionHeader({ ingestion, sectionIngest, loading }) {
  const { t } = useTranslation();

  if (!ingestion) return null;

  const rawTitle =
    ingestion.attributes.sourceFileName ||
    ingestion.attributes.externalSourceUrl;
  const title = rawTitle ? truncate(rawTitle, { length: 30 }) : "";

  const currentState = loading
    ? t("texts.ingestion.states.processing")
    : t(`texts.ingestion.states.${ingestion.attributes.state}`);

  const strategy =
    ingestion.attributes.strategyLabel || t("texts.ingestion.no_strategy");

  const { textId, textSectionId } = ingestion.attributes ?? {};
  const entityId = sectionIngest
    ? textSectionId ?? t("texts.section.ingest_id_placeholder")
    : textId ?? t("texts.ingestion.id_placeholder");

  const idLabelKey = sectionIngest
    ? "texts.section.ingest_id_label"
    : "texts.ingestion.id_label";

  return (
    <div className="ingest-header">
      <div className="ingest-header__inner">
        <header
          className={classNames(
            "ingest-header__content-flex-wrapper",
            "ingest-header__content-flex-wrapper--aib",
            "ingest-header__content-flex-wrapper--tight"
          )}
        >
          <figure
            className={classNames(
              "ingest-header__figure-block",
              "ingest-header__figure-block--shift-left"
            )}
          >
            <div className="ingest-header__figure">
              <IconComposer
                icon="textsBook64"
                size={56}
                className="ingest-header__type-icon"
              />
            </div>
          </figure>
          <div className="ingest-header__title-block">
            <h1 className="ingest-header__title">{title}</h1>
          </div>
        </header>
        <div
          aria-live="polite"
          aria-atomic
          className="ingest-header__body ingestion-output__properties"
        >
          <Property
            label={t("texts.ingestion.current_state_label")}
            value={currentState}
          />
          <Property
            label={t("texts.ingestion.strategy_label")}
            value={strategy}
          />
          <Property label={t(idLabelKey)} value={entityId} />
        </div>
      </div>
    </div>
  );
}

IngestionHeader.displayName = "Ingestion.Header";
