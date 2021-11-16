import * as React from "react";
import PropTypes from "prop-types";
import Link from "react-router-dom";
import lh from "helpers/linkHandler";
import IconComputed from "global/components/icon-computed";
import * as Styled from "./styles";

export default function SummaryHeader({ collection, hero }) {
  const { slug, title, descriptionFormatted: description } = collection;

  const customIcon = (
    <Styled.Icon
      src={collection.customIconStyles.smallSquare}
      alt={`${title} icon`}
    />
  );

  const stockIcon = (
    <Styled.Icon as="div">
      <IconComputed.ProjectCollection
        icon={collection.icon}
        size={60}
        fill={collection.iconFill}
      />
    </Styled.Icon>
  );

  /* eslint-disable no-nested-ternary */
  const icon = collection.customIconStyles.smallSquare
    ? customIcon
    : collection.icon
    ? stockIcon
    : null;

  return (
    <Styled.Wrapper>
      {hero && <Styled.Image src={hero.url} $layout={hero.layout} />}
      <Styled.TitleBlock>
        {slug ? (
          <Link to={lh.link("frontendProjectCollection", slug)}>
            {icon}
            <Styled.Title>{title}</Styled.Title>
          </Link>
        ) : (
          <>
            {icon}
            <Styled.Title>{title}</Styled.Title>
          </>
        )}
      </Styled.TitleBlock>
      {description && <Styled.Description>{description}</Styled.Description>}
    </Styled.Wrapper>
  );
}

SummaryHeader.propTypes = {
  ImageSrc: PropTypes.string,
  collection: PropTypes.object.isRequired
};
