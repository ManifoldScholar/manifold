import styled from "@emotion/styled";

const GAP = "20px";

export const Wrapper = styled.section`
  overflow: hidden;

  &.bg-white + &.bg-white > .container,
  &.bg-neutral05 + &.bg-neutral05 > .container {
    padding-block-start: 0;
  }
`;

export const Inner = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: ${GAP};
`;

export const CountWrapper = styled.div`
  flex-basis: 100%;
  margin-block-start: ${GAP};
`;

export const BodyWrapper = styled.div`
  flex-basis: 100%;
  margin-block-start: ${GAP};

  ${CountWrapper} + & {
    margin-block-start: 0;
  }
`;

export const PaginationWrapper = styled.div`
  flex-basis: 100%;
  margin-block-start: 25px;
`;

export const FooterWrapper = styled.div``;
