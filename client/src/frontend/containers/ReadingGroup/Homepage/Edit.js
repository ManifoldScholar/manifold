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
      <Styled.EditContainer>
        <Styled.Heading>
          {t("pages.reading_group.homepage_edit_header")}
        </Styled.Heading>
        <Styled.Instructions>
          {t("pages.reading_group.homepage_edit_instructions")}
        </Styled.Instructions>
        <Styled.Actions>
          <ActionBox
            title={t("pages.reading_group.search_title")}
            instructions={t("pages.reading_group.search_instructions")}
            actions={
              <Styled.SearchButton href="#search" className="button-tertiary">
                {t("pages.reading_group.search_button_label")}
              </Styled.SearchButton>
            }
          />
        </Styled.Actions>
        <Styled.Body>
          <CollectionEditor
            readingGroup={readingGroup}
            categories={categories}
            responses={responses}
            refresh={refresh}
          />
        </Styled.Body>
      </Styled.EditContainer>
    </Authorize>
  );
}

ReadingGroupHomepageEditContainer.displayName =
  "ReadingGroup.HomepageEditContainer";

ReadingGroupHomepageEditContainer.propTypes = {
  readingGroup: PropTypes.object.isRequired,
  responses: PropTypes.object.isRequired,
  refresh: PropTypes.func.isRequired,
  categories: PropTypes.array
};

export default ReadingGroupHomepageEditContainer;
