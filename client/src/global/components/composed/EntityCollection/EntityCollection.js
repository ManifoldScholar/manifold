import React from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import Header from "./Header";
import * as Styled from "./styles";

function EntityCollection({
  icon,
  title,
  FilterComponent,
  ListComponent,
  FooterComponent,
  countProps,
  paginationProps,
  bgColor = "white"
}) {
  return (
    <section className={`bg-${bgColor}`}>
      <Styled.Inner className="container">
        <Header title={title} icon={icon} />
        {FilterComponent && <FilterComponent />}
        {countProps && (
          <Styled.CountWrapper>
            <Utility.EntityCount {...countProps} />
          </Styled.CountWrapper>
        )}
        <Styled.ListWrapper>
          <ListComponent />
        </Styled.ListWrapper>
        {paginationProps && (
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
    </section>
  );
}

EntityCollection.displayName = "Global.Composed.EntityCollection";

EntityCollection.propTypes = {
  ListComponent: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
  FilterComponent: PropTypes.func,
  FooterComponent: PropTypes.func,
  paginationProps: PropTypes.object,
  countProps: PropTypes.object,
  bgColor: PropTypes.oneOf(["white", "neutral05"])
};

export default EntityCollection;
