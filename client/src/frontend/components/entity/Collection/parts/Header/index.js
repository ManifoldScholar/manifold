import React from "react";
import PropTypes from "prop-types";
import Collecting from "frontend/components/collecting";
import { containerWidth } from "theme/styles/variables/layout";
import * as Styled from "./styles";

const imageSize = parseInt(Styled.IMAGE_MAX_HEIGHT, 10);

function getImageWidthAttr(layout) {
  switch (layout) {
    case "full_bleed":
    case "wide_inset":
      return parseInt(containerWidth.inner, 10);
    default:
      return imageSize;
  }
}

function Header({
  title,
  icon,
  IconComponent,
  iconProps,
  description,
  DescriptionComponent,
  image,
  imageAlt,
  ImageComponent,
  headerLayout,
  headerWidth = "auto",
  headerLink,
  collectingProps
}) {
  if (!title) return null;

  const hasImage = image || ImageComponent;
  const hasDescription = description || DescriptionComponent;

  function getValidatedLayout() {
    if (!hasImage && !hasDescription) return "title_only";
    if (!hasImage && hasDescription) return "title_description";
    return headerLayout || "title_image";
  }

  const layout = getValidatedLayout();

  return (
    <Styled.Header $layout={layout} $width={headerWidth}>
      <Styled.TitleAndIcon>
        {IconComponent && (
          <Styled.IconComponent as={IconComponent} {...iconProps} />
        )}
        {!IconComponent && icon && (
          <Styled.Icon
            size={iconProps?.size ?? 60}
            icon={icon}
            {...iconProps}
          />
        )}
        <Styled.TitleLink to={headerLink}>
          <Styled.Title>{title}</Styled.Title>
        </Styled.TitleLink>
        {!!collectingProps && (
          <Styled.ToggleWrapper>
            <Collecting.Toggle {...collectingProps} />
          </Styled.ToggleWrapper>
        )}
      </Styled.TitleAndIcon>
      {description && (
        <Styled.Description dangerouslySetInnerHTML={{ __html: description }} />
      )}
      {DescriptionComponent && (
        <Styled.Description>{DescriptionComponent()}</Styled.Description>
      )}
      {image && (
        <Styled.Image
          src={image}
          alt={imageAlt ?? ""}
          width={getImageWidthAttr(layout)}
          height={imageSize}
          loading="lazy"
          $layout={layout}
        />
      )}
      {ImageComponent && (
        <Styled.ImageComponent>{ImageComponent()}</Styled.ImageComponent>
      )}
    </Styled.Header>
  );
}

Header.displayName = "Frontend.Entity.Collection.Header";

export const headerProps = {
  title: PropTypes.string,
  icon: PropTypes.string,
  IconComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  description: PropTypes.string,
  DescriptionComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  image: PropTypes.string,
  ImageComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  headerLayout: PropTypes.string,
  headerLink: PropTypes.string,
  headerWidth: PropTypes.string,
  collectingProps: PropTypes.object
};

Header.propTypes = headerProps;

export default Header;
