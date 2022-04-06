import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import ActionBox from "frontend/components/reading-group/ActionBox";
import { CollectionEditor } from "frontend/components/collecting/reading-group";
import * as Styled from "./styles";

import Authorize from "hoc/Authorize";

function ReadingGroupHomepageEditContainer({
  readingGroup,
  categories,
  responses,
  refresh
}) {
  const { t } = useTranslation();

  return (
    <Authorize
      entity={readingGroup}
      ability="update"
      failureRedirect={lh.link(
        "frontendReadingGroupHomepageStatic",
        readingGroup.id
      )}
    >
      <div className="group-homepage-editor">
        <h2 className="group-homepage-editor__heading">
          {t("pages.frontend.reading_group.homepage_edit_header")}
        </h2>
        <p className="group-homepage-editor__instructions">
          {t("pages.frontend.reading_group.homepage_edit_instructions")}
        </p>
        <div className="group-homepage-editor__actions">
          <ActionBox
            title={t("pages.frontend.reading_group.search_title")}
            instructions={t("pages.frontend.reading_group.search_instructions")}
            actions={
              <Styled.SearchButton href="#search" className="button-tertiary">
                {t("pages.frontend.reading_group.search_button_label")}
              </Styled.SearchButton>
            }
          />
        </div>
        <div className="group-homepage-editor__body">
          <CollectionEditor
            readingGroup={readingGroup}
            categories={categories}
            responses={responses}
            refresh={refresh}
          />
        </div>
      </div>
    </Authorize>
  );
}

ReadingGroupHomepageEditContainer.displayName =
  "ReadingGroup.HomepageEditContainer";

ReadingGroupHomepageEditContainer.propTypes = {
  readingGroup: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  responses: PropTypes.object.isRequired,
  refresh: PropTypes.func.isRequired
};

export default ReadingGroupHomepageEditContainer;
