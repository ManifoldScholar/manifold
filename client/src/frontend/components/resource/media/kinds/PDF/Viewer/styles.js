import styled from "@emotion/styled";

export const Wrapper = styled.div`
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  background-color: var(--color-base-neutral90);

  ${({ $fixedAspectRatio }) =>
    $fixedAspectRatio
      ? `
        position: absolute;
        inset: 0;
        overflow: hidden;`
      : `
        inline-size: 100%;`}
`;

// The stage is measured to size the canvas, so it must not depend on the
// canvas's own size when the aspect ratio is fixed.
export const Stage = styled.div`
  position: relative;
  display: grid;
  place-items: center;
  min-block-size: 0;

  ${({ $fixedAspectRatio }) =>
    $fixedAspectRatio
      ? `
        overflow: hidden;`
      : `
        min-block-size: 200px;
        max-block-size: 80dvh;
        overflow: auto;
        scrollbar-gutter: stable;`}
`;

export const Canvas = styled.canvas`
  display: block;
  max-inline-size: 100%;
  background-color: var(--color-base-neutral-white);

  &[hidden] {
    display: none;
  }
`;

export const Loading = styled.p`
  position: absolute;
  inset-block-start: 50%;
  inset-inline: 0;
  margin: 0;
  text-align: center;
  color: var(--color-base-neutral-white);
  transform: translateY(-50%);
`;

export const Message = styled.p`
  margin: 0;
  padding: 20px;
  text-align: center;
  background-color: var(--color-base-neutral90);
  color: var(--color-base-neutral-white);

  ${({ $fixedAspectRatio }) =>
    $fixedAspectRatio &&
    `
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;`}
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 8px;
`;

export const Status = styled.span`
  color: var(--color-base-neutral-white);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;
