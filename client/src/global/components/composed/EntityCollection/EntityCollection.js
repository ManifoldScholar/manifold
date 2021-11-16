import React from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import Utility from "global/components/utility";
import Header, { headerProps } from "./parts/Header";
import * as Styled from "./styles";
import * as shapes from "./shapes";

function EntityCollection({
  icon,
  IconComponent,
  title,
  description,
  image,
  headerLayout,
  headerLink,
  UtilityComponent,
  BodyComponent,
  FooterComponent,
  countProps,
  paginationProps,
  bgColor = "white"
}) {
  return (
    <Styled.Wrapper className={`bg-${bgColor}`}>
      <Styled.Inner className="container">
        <Header
          title={title}
          icon={icon}
          IconComponent={IconComponent}
          description={description}
          image={image}
          headerLayout={headerLayout}
          headerLink={headerLink}
        />
        {UtilityComponent && <UtilityComponent />}
        {!isEmpty(countProps) && (
          <Styled.CountWrapper>
            <Utility.EntityCount {...countProps} />
          </Styled.CountWrapper>
        )}
        <Styled.BodyWrapper>
          <BodyComponent />
        </Styled.BodyWrapper>
        {!isEmpty(paginationProps) && (
          <Styled.PaginationWrapper>
            <Utility.Pagination {...paginationProps} />
          </Styled.PaginationWrapper>
        )}
        {FooterComponent && (
          <Styled.FooterWrapper>
            <FooterComponent />
          </Styled.FooterWrapper>
        )}
      </Styled.Inner>
    </Styled.Wrapper>
  );
}

EntityCollection.displayName = "Global.Composed.EntityCollection";

EntityCollection.propTypes = {
  BodyComponent: PropTypes.func.isRequired,
  IconComponent: PropTypes.node,
  UtilityComponent: PropTypes.func,
  FooterComponent: PropTypes.func,
  countProps: shapes.count,
  paginationProps: shapes.pagination,
  bgColor: PropTypes.oneOf(["white", "neutral05"]),
  ...headerProps
};

export default EntityCollection;
