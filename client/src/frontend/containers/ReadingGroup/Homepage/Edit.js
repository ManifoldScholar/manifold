import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import lh from "helpers/linkHandler";
import ActionBox from "frontend/components/reading-group/ActionBox";
import { CollectionEditor } from "frontend/components/collecting/reading-group";
import * as Styled from "./styles";

import Authorize from "hoc/Authorize";

function ReadingGroupHomepageEditContainer() {
  const { readingGroup, categories, responses, refresh } =
    useOutletContext() || {};
  const { t } = useTranslation();

  return (
    <Authorize
      entity={readingGroup}
      ability="update"
      failureRedirect={lh.link(
        "frontendReadingGroupHomepageStatic",
        readingGroup.id
      )}
      failureNotification={{
        body: t("errors.access_denied.authorization_reading_group_edit")
      }}
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

export default ReadingGroupHomepageEditContainer;
