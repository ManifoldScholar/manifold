import React from "react";
import PropTypes from "prop-types";
import { useUIDSeed } from "react-uid";
import { useTranslation } from "react-i18next";
import SectionLabel from "global/components/form/SectionLabel";
import Checkbox from "./Checkbox";
import { inCollection } from "../helpers";
import * as Styled from "./styles";

function CollectingDialog({
  collectable,
  title,
  readingGroups,
  currentUser,
  onChange,
  onClose
}) {
  const uidSeed = useUIDSeed();
  const { t } = useTranslation();

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
    <Styled.Wrapper
      labelledBy={uidSeed("label")}
      describedBy={uidSeed("description")}
      closeCallback={onClose}
      maxWidth={550}
      onClick={event => event.stopPropagation()}
    >
      <Styled.Inner>
        <Styled.Header>
          <Styled.Title id={uidSeed("label")}>{title}</Styled.Title>
          <Styled.Icon icon="TextsLoosePages64" size={48} />
        </Styled.Header>
        <Styled.Fields>
          <SectionLabel
            as="legend"
            headingAs="h3"
            label={`${t("forms.add_to")}:`}
          />
          <Styled.Group>
            <Checkbox
              label={t("forms.my_starred_label")}
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
          </Styled.Group>
        </Styled.Fields>
        <Styled.Footer>
          <Styled.Close onClick={handleCloseClick} className="button-secondary">
            Close
          </Styled.Close>
        </Styled.Footer>
      </Styled.Inner>
    </Styled.Wrapper>
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
