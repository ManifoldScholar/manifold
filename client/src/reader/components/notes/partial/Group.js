import React, { useEffect, useState } from "react";
import GroupItem from "./GroupItem";
import PropTypes from "prop-types";
import classNames from "classnames";
import debounce from "lodash/debounce";
import Collapse from "global/components/Collapse";
import IconComposer from "global/components/utility/IconComposer";

export default function Group(props) {
  const {
    readerSection,
    annotations,
    sectionName,
    visitHandler,
    showAnnotationCreator
  } = props;

  const [initialVisible, setInitialVisible] = useState(false);

  useEffect(() => {
    const preOpenItem = debounce(() => {
      const expanded = readerSection.attributes.name === sectionName;
      return setInitialVisible(expanded);
    }, 200);
    preOpenItem();
  }, [readerSection, sectionName]);

  const renderGroupItems = notes => {
    return (
      <Collapse.Content>
        {visible => (
          <ul
            className={classNames({
              "notes-filtered-list__group": true,
              "notes-filtered-list__group--expanded": visible
            })}
          >
            {notes.map(annotation => {
              return (
                <GroupItem
                  key={annotation.id}
                  annotation={annotation}
                  visitHandler={visitHandler}
                  showAnnotationCreator={showAnnotationCreator}
                />
              );
            })}
          </ul>
        )}
      </Collapse.Content>
    );
  };

  return (
    <Collapse initialVisible={initialVisible}>
      <li className="notes-filtered-list__section">
        <Collapse.Toggle className="notes-filtered-list__section-button">
          {visible => (
            <div className="notes-filtered-list__section-button-inner">
              <IconComposer
                icon="disclosureDown24"
                size="default"
                className={classNames({
                  "notes-filtered-list__disclosure-icon": true,
                  "notes-filtered-list__disclosure-icon--expanded": visible
                })}
              />
              <span className="notes-filtered-list__section-label">
                {sectionName}
              </span>
            </div>
          )}
        </Collapse.Toggle>
        {renderGroupItems(annotations)}
      </li>
    </Collapse>
  );
}

Group.displayName = "Notes.Partial.Group";

Group.propTypes = {
  readerSection: PropTypes.object,
  annotations: PropTypes.array,
  sectionName: PropTypes.string,
  visitHandler: PropTypes.func,
  showAnnotationCreator: PropTypes.bool
};
