import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import useDialog from "@castiron/hooks/useDialog";
import getKindComponent from "../media/getKindComponent";
import * as Styled from "./styles";

export default function ResourceListSlideZoom({ resource, label }) {
  const { t } = useTranslation();

  const dialog = useDialog({
    modal: true,
    scrollLockClassName: "no-scroll"
  });

  const KindComponent = getKindComponent(resource.attributes.kind);

  if (!KindComponent) return null;

  return (
    <>
      <Styled.ZoomIndicator
        ref={dialog.toggleRef}
        onClick={dialog.onToggleClick}
        size="sm"
        background="neutral"
        label={label ?? t("actions.zoom")}
        postIcon="zoomIn16"
      />
      <Styled.Dialog title={resource.attributes.title} {...dialog}>
        <Styled.DialogInner>
          <KindComponent resource={resource} fixedAspectRatio={false} />
        </Styled.DialogInner>
      </Styled.Dialog>
    </>
  );
}

ResourceListSlideZoom.displayName = "ResourceList.Slide.Zoom";

ResourceListSlideZoom.propTypes = {
  resource: PropTypes.object.isRequired,
  label: PropTypes.string
};
