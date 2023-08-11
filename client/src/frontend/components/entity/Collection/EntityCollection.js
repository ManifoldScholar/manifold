import React from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import classNames from "classnames";
import Box from "global/components/atomic/Box";
import Utility from "global/components/utility";
import Header, { headerProps } from "./parts/Header";
import { ListFilters } from "global/components/list";
import * as Styled from "./styles";
import * as shapes from "./shapes";

function EntityCollection({
  icon,
  IconComponent,
  iconProps,
  title,
  description,
  DescriptionComponent,
  image,
  imageAlt,
  ImageComponent,
  headerLayout,
  headerWidth,
  headerLink,
  collectingProps,
  BodyComponent,
  FooterComponent,
  UtilityComponent,
  countProps,
  paginationProps,
  bgColor = "white",
  nested,
  boxed,
  className,
  filterProps
}) {
  return (
    <Styled.Wrapper
      $nested={nested}
      $boxed={boxed}
      as={!!boxed && Box}
      className={classNames({
        [`bg-${bgColor}`]: !nested && !boxed,
        [className]: !!className
      })}
    >
      <Styled.Inner className={!nested && !boxed ? "container" : null}>
        <Header
          title={title}
          icon={icon}
          IconComponent={IconComponent}
          iconProps={iconProps}
          description={description}
          DescriptionComponent={DescriptionComponent}
          image={image}
          imageAlt={imageAlt}
          ImageComponent={ImageComponent}
          headerLayout={headerLayout}
          headerWidth={headerWidth}
          headerLink={headerLink}
          collectingProps={collectingProps}
        />
        {filterProps && <ListFilters {...filterProps} />}
        {UtilityComponent && <UtilityComponent />}
        {!isEmpty(countProps) && (
          <Styled.CountWrapper $hasHeader={!!title}>
            <Utility.EntityCount {...countProps} />
          </Styled.CountWrapper>
        )}
        <Styled.BodyWrapper>{BodyComponent()}</Styled.BodyWrapper>
        {!isEmpty(paginationProps) && (
          <Styled.PaginationWrapper>
            <Utility.Pagination {...paginationProps} />
          </Styled.PaginationWrapper>
        )}
        {FooterComponent && (
          <Styled.FooterWrapper>{FooterComponent()}</Styled.FooterWrapper>
        )}
      </Styled.Inner>
    </Styled.Wrapper>
  );
}

EntityCollection.displayName = "Frontend.Entity.Collection";

EntityCollection.propTypes = {
  BodyComponent: PropTypes.func.isRequired,
  FooterComponent: PropTypes.func,
  UtilityComponent: PropTypes.func,
  countProps: shapes.count,
  paginationProps: shapes.pagination,
  filterProps: PropTypes.object,
  bgColor: PropTypes.oneOf(["white", "neutral05"]),
  nested: PropTypes.bool,
  boxed: PropTypes.bool,
  className: PropTypes.string,
  ...headerProps
};

export default EntityCollection;
