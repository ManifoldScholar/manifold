import React from "react";
import PropTypes from "prop-types";
import ListItem from "frontend/components/content-block/Block/types/Texts/ListItem";
import Template from "../Template";
import DeferredCollectable from "../DeferredCollectable";

function CollectedTexts({ collectedIds, responses, onUncollect, nested }) {
  if (collectedIds.length < 1) return null;

  return (
    <Template title="Texts" icon="textsStacked64" nested={nested}>
      <div className="text-list__category">
        <ul className="text-list__list text-list__list--no-label">
          {collectedIds.map(id => (
            <li key={id} className="text-list__item">
              <DeferredCollectable id={id} type="texts" responses={responses}>
                {response => {
                  return (
                    <ListItem
                      text={response}
                      showAuthors={false}
                      showDates
                      showDescriptions={false}
                      showSubtitles
                      onUncollect={onUncollect}
                    />
                  );
                }}
              </DeferredCollectable>
            </li>
          ))}
        </ul>
      </div>
    </Template>
  );
}

CollectedTexts.displayName = "ReadingGroup.Collecting.CollectedTexts";

CollectedTexts.propTypes = {
  collectedIds: PropTypes.array.isRequired,
  responses: PropTypes.array.isRequired,
  onUncollect: PropTypes.func,
  nested: PropTypes.bool
};

export default CollectedTexts;
