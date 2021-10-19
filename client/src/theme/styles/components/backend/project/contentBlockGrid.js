const GRID_GAP = 18;
const ITEM_PADDING = 9;

export default `
  .block-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(245px, 1fr));
    row-gap: ${GRID_GAP - ITEM_PADDING * 2}px;
    column-gap: ${GRID_GAP}px;
    margin-top: ${GRID_GAP}px;
    width: 100%;
    padding-right: 0;
    padding-left: 0;
  }
`;
