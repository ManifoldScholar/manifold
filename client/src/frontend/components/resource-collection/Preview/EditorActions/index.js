import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Button from "global/components/atomic/Button";
import lh from "helpers/linkHandler";
import Authorize from "hoc/Authorize";
import { useFromStore } from "hooks";
import * as Styled from "frontend/components/resource/Preview/EditorActions/styles";

const BUTTON_STYLE_PROPS = {
  size: "sm",
  shape: "lozenge",
  background: "outline",
  lowercase: false
};

function ResourceCollectionPreviewEditorActions({
  resourceCollection,
  textId,
  destroyAnnotation
}) {
  const { t } = useTranslation();

  const text = useFromStore({
    action: "grab",
    entityType: "texts",
    id: textId
  });

  const project = useFromStore({
    action: "grab",
    entityType: "projects",
    id: resourceCollection.attributes?.projectId
  });

  return (
    <Styled.List>
      <Authorize entity={text ?? project} ability={"manageResources"}>
        <li>
          <Button
            as={Link}
            to={lh.link("backendResourceCollection", resourceCollection.id)}
            label={t("actions.edit")}
            preIcon="pencil24"
            {...BUTTON_STYLE_PROPS}
          />
        </li>
      </Authorize>
      {!!text && !!destroyAnnotation && (
        <Authorize entity={text} ability={"notate"}>
          <li>
            <Button
              onClick={destroyAnnotation}
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

ResourceCollectionPreviewEditorActions.displayName =
  "ResourceCollection.Preview.EditorActions";

ResourceCollectionPreviewEditorActions.propTypes = {
  resourceCollection: PropTypes.object.isRequired,
  textId: PropTypes.string,
  destroyAnnotation: PropTypes.func
};

export default ResourceCollectionPreviewEditorActions;
