import React from "react";
import PropTypes from "prop-types";
import { useUIDSeed } from "react-uid";
import flatMapDepth from "lodash/flatMapDepth";
import identity from "lodash/identity";
import IconComposer from "global/components/utility/IconComposer";
import Dialog from "global/components/dialog";
import SectionLabel from "global/components/form/SectionLabel";
import Checkbox from "./Checkbox";

function CollectingDialog({
  collectable,
  title,
  myCollection,
  readingGroups,
  currentUser,
  onChange,
  onClose
}) {
  const uidSeed = useUIDSeed();

  function collectedIdsForCollection(collection) {
    if (!collection) return [];
    const mappings = collection.attributes.categoryMappings;
    return flatMapDepth(
      Object.values(mappings).map(mapping => Object.values(mapping)),
      identity,
      2
    );
  }

  function inCollection(collection) {
    const collectedIds = collectedIdsForCollection(collection);
    return collectedIds.includes(collectable.id);
  }

  function inMyCollection() {
    return inCollection(myCollection);
  }

  function inReadingGroup(id) {
    const group = readingGroups.find(rg => rg.id === id);
    if (!group) return false;
    return inCollection(group.relationships.collection);
  }

  function collectionForId(id) {
    if (id === "me") return currentUser;
    return readingGroups.find(rg => rg.id === id);
  }

  function onCheckboxChange(event) {
    const collectionId = event.target.value;
    const collection = collectionForId(collectionId);
    const collected =
      collectionId === "me" ? inMyCollection() : inReadingGroup(collectionId);
    onChange(collected, collection);
  }

  function handleCloseClick(event) {
    event.stopPropagation();
    onClose();
  }

  return (
    <Dialog.Wrapper
      labelledBy={uidSeed("label")}
      describedBy={uidSeed("description")}
      closeCallback={onClose}
      maxWidth={550}
      className="collecting-dialog"
    >
      <div className="collecting-dialog__inner">
        <header className="collecting-dialog__header">
          <h2 id={uidSeed("label")} className="collecting-dialog__title">
            {title}
          </h2>
          <IconComposer
            icon="TextsLoosePages64"
            size={48}
            iconClass="collecting-dialog__header-icon"
          />
        </header>
        <fieldset className="collecting-dialog__fieldset">
          <SectionLabel as="legend" label="Add this to:" />
          <div className="collecting-dialog__checkbox-group">
            <Checkbox
              label="My Collection"
              value="me"
              onChange={onCheckboxChange}
              checked={inMyCollection()}
            />
            {readingGroups.map(group => {
              const {
                id,
                attributes: { name, privacy }
              } = group;
              return (
                <Checkbox
                  key={id}
                  label={name}
                  value={id}
                  onChange={onCheckboxChange}
                  checked={inReadingGroup(id)}
                  showLock={privacy === "private"}
                />
              );
            })}
          </div>
        </fieldset>
        <div className="collecting-dialog__footer">
          <button
            onClick={handleCloseClick}
            className="collecting-dialog__close-button button-secondary"
          >
            Close
          </button>
        </div>
      </div>
    </Dialog.Wrapper>
  );
}

CollectingDialog.displayName = "Collecting.Dialog";

CollectingDialog.propTypes = {
  collectable: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  myCollection: PropTypes.object.isRequired,
  readingGroups: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default CollectingDialog;
