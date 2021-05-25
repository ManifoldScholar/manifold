import React from "react";
import PropTypes from "prop-types";
import CollectionBlock from "frontend/components/collecting/CollectionBlock";
import DeferredCollectable from "frontend/components/collecting/reading-group/static/DeferredCollectable";
import ListItem from "frontend/components/content-block/Block/types/Texts/ListItem";

function CollectedTexts({ collectedIds, responses, onUncollect }) {
  if (collectedIds.length < 1) return null;

  return (
    <CollectionBlock title="Texts" icon="textsStacked64" nested>
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
    </CollectionBlock>
  );
}

CollectedTexts.displayName = "ReadingGroup.Collecting.CollectedTexts";

CollectedTexts.propTypes = {
  collectedIds: PropTypes.array.isRequired,
  responses: PropTypes.array.isRequired,
  onUncollect: PropTypes.func
};

export default CollectedTexts;
