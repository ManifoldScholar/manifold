import React from "react";
import PropTypes from "prop-types";
import { useUIDSeed } from "react-uid";
import IconComposer from "global/components/utility/IconComposer";
import Dialog from "global/components/dialog";
import SectionLabel from "global/components/form/SectionLabel";
import Checkbox from "./Checkbox";
import { inCollection } from "../helpers";

function CollectingDialog({
  collectable,
  title,
  readingGroups,
  currentUser,
  onChange,
  onClose
}) {
  const uidSeed = useUIDSeed();

  function inMyCollection() {
    return inCollection(currentUser, collectable);
  }

  function getReadingGroup(id) {
    return readingGroups.find(rg => rg.id === id);
  }

  function inReadingGroup(id) {
    return inCollection(getReadingGroup(id), collectable);
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
  readingGroups: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default CollectingDialog;
