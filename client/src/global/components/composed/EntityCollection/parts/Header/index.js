import React from "react";
import PropTypes from "prop-types";
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
  description,
  image,
  headerLayout,
  headerLink
}) {
  return (
    <Styled.Header $layout={headerLayout}>
      <Styled.TitleAndIcon>
        {IconComponent && <Styled.IconComponent as={IconComponent} />}
        {!IconComponent && icon && <Styled.Icon size={60} icon={icon} />}
        <Styled.TitleLink to={headerLink}>
          <Styled.Title>{title}</Styled.Title>
        </Styled.TitleLink>
      </Styled.TitleAndIcon>
      {description && (
        <Styled.Description dangerouslySetInnerHTML={{ __html: description }} />
      )}
      {image && (
        <Styled.Image
          src={image}
          alt=""
          width={getImageWidthAttr(headerLayout)}
          height={imageSize}
          $layout={headerLayout}
        />
      )}
    </Styled.Header>
  );
}

Header.displayName = "Global.Composed.EntityCollection.Header";

export const headerProps = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
  IconComponent: PropTypes.node,
  description: PropTypes.string,
  image: PropTypes.string,
  headerLayout: PropTypes.string,
  headerLink: PropTypes.string
};

Header.propTypes = headerProps;

export default Header;
