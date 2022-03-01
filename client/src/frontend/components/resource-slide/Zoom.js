import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import ResourcePreview from "frontend/components/resource-preview";
import IconComposer from "global/components/utility/IconComposer";

export default function ResourceListSlideZoom({ resource, label }) {
  const { t } = useTranslation();

  return (
    <ResourcePreview resource={resource}>
      <div className="zoom-indicator">
        <span className="zoom-indicator__text">
          {label ?? t("actions.zoom")}
        </span>
        <IconComposer
          icon="zoomIn16"
          size={21.333}
          className="zoom-indicator__icon"
        />
      </div>
    </ResourcePreview>
  );
}

ResourceListSlideZoom.displayName = "ResourceList.Slide.Zoom";

ResourceListSlideZoom.propTypes = {
  resource: PropTypes.object.isRequired,
  label: PropTypes.string
};
