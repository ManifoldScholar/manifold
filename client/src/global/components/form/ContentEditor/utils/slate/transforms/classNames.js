import { Transforms } from "slate";

export const setBlockClassName = ({ editor, block, path, className }) => {
  Transforms.setNodes(
    editor,
    {
      ...block,
      htmlAttrs: {
        ...block.htmlAttrs,
        class: className
      }
    },
    { at: path, mode: "highest" }
  );
};

export const wrapWithStyledFigure = ({
  editor,
  imageNode,
  imagePath,
  className
}) => {
  Transforms.wrapNodes(
    editor,
    {
      type: "figure",
      children: [imageNode],
      htmlAttrs: { class: className }
    },
    { at: imagePath }
  );
};
