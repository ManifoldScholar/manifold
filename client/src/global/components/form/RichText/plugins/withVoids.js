import { rteElements, renderedElements, markElements } from "../rteElements";

const withVoids = editor => {
  const { isVoid } = editor

  editor.isVoid = element => {
    const isRteEl = rteElements.includes(element.type);
    const isRendered = renderedElements.includes(element.type);
    const isMark = markElements.includes(element.type);
    return !(isRteEl || isRendered || isMark) ? true : isVoid(element)
  }

  return editor
}

export default withVoids;
