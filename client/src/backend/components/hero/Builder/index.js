import PropTypes from "prop-types";
import { UIDConsumer } from "react-uid";
import Block from "./Block";
import ActionCallouts from "./ActionCallouts";
import SectionLabel from "global/components/form/SectionLabel";
import { useTranslation } from "react-i18next";
import * as Styled from "./styles";

const defaultActionCalloutSlots = [
  "left-button",
  "left-link",
  "right-button",
  "right-link"
];

const defaultActionCalloutEditRoute = (modelId, calloutId) =>
  `/backend/projects/${modelId}/layout/action-callout/${calloutId}`;

const defaultActionCalloutNewRoute = modelId =>
  `/backend/projects/${modelId}/layout/action-callout/new`;

function Builder({
  include = [],
  model,
  modelLabel,
  actionCalloutEditRoute = defaultActionCalloutEditRoute,
  actionCalloutNewRoute = defaultActionCalloutNewRoute,
  actionCallouts,
  actionCalloutSlots = defaultActionCalloutSlots,
  refreshActionCallouts,
  onEditHero
}) {
  const { t } = useTranslation();
  const label = modelLabel ?? t("glossary.project_one");

  return (
    <UIDConsumer name={id => `hero-builder-${id}`}>
      {id => (
        <section className="hero-builder">
          <div
            role="group"
            aria-labelledby={`${id}-header`}
            aria-describedby={`${id}-instructions`}
          >
            <SectionLabel label={t("layout.hero_block")} id={`${id}-header`} />
            <Styled.Instructions id={`${id}-instructions`}>
              {t("layout.hero_block_instructions", {
                entity: label
              })}
            </Styled.Instructions>

            {(include.includes("projectDescription") ||
              include.includes("journalDescription")) && (
              <Block
                title={t("layout.description_and_images")}
                description={t("layout.description_and_images_description")}
                onEdit={onEditHero}
              />
            )}
            {include.includes("actionCallouts") && (
              <Block
                title={t("layout.calls_to_action")}
                description={t("layout.calls_to_action_description")}
              >
                {actionCallouts && (
                  <ActionCallouts
                    refreshActionCallouts={refreshActionCallouts}
                    model={model}
                    actionCalloutSlots={actionCalloutSlots}
                    actionCallouts={actionCallouts}
                    actionCalloutNewRoute={actionCalloutNewRoute}
                    actionCalloutEditRoute={actionCalloutEditRoute}
                  />
                )}
              </Block>
            )}
          </div>
        </section>
      )}
    </UIDConsumer>
  );
}

Builder.displayName = "Hero.Builder";

Builder.propTypes = {
  include: PropTypes.arrayOf(
    PropTypes.oneOf([
      "projectDescription",
      "journalDescription",
      "actionCallouts"
    ])
  ),
  model: PropTypes.object.isRequired,
  modelLabel: PropTypes.string,
  actionCalloutEditRoute: PropTypes.func,
  actionCalloutNewRoute: PropTypes.func,
  actionCallouts: PropTypes.array,
  actionCalloutSlots: PropTypes.array,
  refreshActionCallouts: PropTypes.func.isRequired,
  onEditHero: PropTypes.func.isRequired
};

export default Builder;
