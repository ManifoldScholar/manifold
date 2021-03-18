import React from "react";
import PropTypes from "prop-types";
import ActionBox from "frontend/components/reading-group/ActionBox";
import { CollectionEditor } from "frontend/components/collecting/reading-group";

function ReadingGroupHomepageEditContainer({
  readingGroup,
  categories,
  responses,
  refresh,
  dispatch
}) {
  return (
    <div className="group-homepage-editor">
      <h2 className="group-homepage-editor__heading">Edit Home Page</h2>
      <p className="group-homepage-editor__instructions">
        Organize and edit the contents of your Reading Group’s home page. Search
        for new content to add. Create your own Categories and add or edit
        category descriptions. Move content between categories and within
        content types by dragging with the handle.
      </p>
      <div className="group-homepage-editor__actions">
        <ActionBox
          title="Search + add content:"
          instructions="Search for and star the content you want to add to the home page:"
          actions={
            <a href="#search" className="group-page-heading__nav-button">
              Add content
            </a>
          }
        />
      </div>
      <div className="group-homepage-editor__body">
        <CollectionEditor
          readingGroup={readingGroup}
          categories={categories}
          responses={responses}
          refresh={refresh}
          dispatch={dispatch}
        />
      </div>
    </div>
  );
}

ReadingGroupHomepageEditContainer.displayName =
  "ReadingGroup.HomepageEditContainer";

ReadingGroupHomepageEditContainer.propTypes = {
  readingGroup: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  responses: PropTypes.object.isRequired,
  refresh: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default ReadingGroupHomepageEditContainer;
