import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "global/components/atomic/Button";
import lh from "helpers/linkHandler";
import Authorize from "hoc/Authorize";
import { useFromStore } from "hooks";
import * as Styled from "./styles";

const BUTTON_STYLE_PROPS = {
  size: "sm",
  shape: "lozenge",
  background: "outline",
  lowercase: false
};

function ResourcePreviewEditorActions({ resource, textId }) {
  const { t } = useTranslation();

  const text = useFromStore({
    action: "grab",
    entityType: "texts",
    id: textId
  });

  const project = useFromStore({
    action: "grab",
    entityType: "projects",
    id: resource.attributes?.projectId
  });

  return (
    <Styled.List>
      <Authorize entity={text ?? project} ability={"manageResources"}>
        <li>
          <Button
            as={Link}
            to={lh.link("backendResource", resource.id)}
            label={t("actions.edit")}
            preIcon="pencil24"
            {...BUTTON_STYLE_PROPS}
          />
        </li>
      </Authorize>
      {text && (
        <Authorize entity={text} ability={"notate"}>
          <li>
            <Button
              onClick={() => {}}
              label={t("actions.remove")}
              preIcon="delete24"
              {...BUTTON_STYLE_PROPS}
            />
          </li>
        </Authorize>
      )}
    </Styled.List>
  );
}

ResourcePreviewEditorActions.displayName = "Resource.Preview.EditorActions";

ResourcePreviewEditorActions.propTypes = {
  resource: PropTypes.object.isRequired,
  textId: PropTypes.string
};

export default ResourcePreviewEditorActions;
