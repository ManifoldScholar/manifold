import PropTypes from "prop-types";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import Button from "components/global/atomic/Button";
import Authorize from "components/hoc/Authorize";
import { useLoaderEntity } from "hooks";
import * as Styled from "components/frontend/resource/Preview/EditorActions/styles";

const BUTTON_STYLE_PROPS = {
  size: "sm",
  shape: "lozenge",
  background: "outline",
  lowercase: false
};

function ResourceCollectionPreviewEditorActions({
  resourceCollection,
  destroyAnnotation
}) {
  const { t } = useTranslation();

  const text = useLoaderEntity("texts");
  const project = useLoaderEntity("projects");

  return (
    <Styled.List>
      <Authorize entity={text ?? project} ability={"manageResources"}>
        <li>
          <Button
            as={Link}
            to={`/backend/resource-collections/${resourceCollection.id}`}
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
  destroyAnnotation: PropTypes.func
};

export default ResourceCollectionPreviewEditorActions;
