import PropTypes from "prop-types";
import * as Styled from "./styles";

export default function DropIndicator({ instruction, indentPerLevel }) {
  if (!instruction) return null;

  switch (instruction.type) {
    case "reorder-above":
      return (
        <Styled.DropLine
          $edge="top"
          $inset={instruction.currentLevel * indentPerLevel}
        />
      );
    case "reorder-below":
      return (
        <Styled.DropLine
          $edge="bottom"
          $inset={instruction.currentLevel * indentPerLevel}
        />
      );
    case "reparent":
      return (
        <Styled.DropLine
          $edge="bottom"
          $inset={instruction.desiredLevel * indentPerLevel}
        />
      );
    default:
      return null;
  }
}

DropIndicator.propTypes = {
  instruction: PropTypes.object,
  indentPerLevel: PropTypes.number.isRequired
};
