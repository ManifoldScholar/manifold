import actionCalloutSlot from "./actionCalloutSlot";
import avatarBuilder from "./avatarBuilder";
import colorPicker from "./colorPicker";
import contentBlock from "./contentBlock";
import contentBlockGrid from "./contentBlockGrid";
import contentBlockList from "./contentBlockList";
import heroBuilder from "./heroBuilder";
import heroBuilderBlock from "./heroBuilderBlock";

export default `
  ${avatarBuilder}
  ${colorPicker}
  ${contentBlock}
  ${contentBlockGrid}
  ${contentBlockList}
  ${heroBuilder}
  ${heroBuilderBlock}
  ${actionCalloutSlot}
`;
