import { insertImage } from "../utils/slate/transforms";
import { isImageUrl } from "../utils/helpers";

/* eslint-disable no-param-reassign */
const withImages = editor => {
  const { insertData } = editor;

  editor.insertData = data => {
    const text = data.getData("text/plain");
    const { files } = data;

    const image = files?.item(0);

    if (image) {
      const reader = new FileReader();
      const [mime] = image.type.split("/");
      if (mime === "image") {
        reader.addEventListener("load", () => {
          const url = reader.result;
          insertImage(editor, url);
        });

        reader.readAsDataURL(image);
        return;
      }
    }

    if (isImageUrl(text)) {
      insertImage(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

export default withImages;
