import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import ResourcePreview from "frontend/components/resource-preview";
import * as Styled from "./styles";

export default function ResourceListSlideZoom({ resource, label }) {
  const { t } = useTranslation();

  return (
    <ResourcePreview resource={resource} toggleType="slide">
      <Styled.ZoomIndicator>
        <span>{label ?? t("actions.zoom")}</span>
        <Styled.Icon icon="zoomIn16" size={21.333} />
      </Styled.ZoomIndicator>
    </ResourcePreview>
  );
}

ResourceListSlideZoom.displayName = "ResourceList.Slide.Zoom";

ResourceListSlideZoom.propTypes = {
  resource: PropTypes.object.isRequired,
  label: PropTypes.string
};
