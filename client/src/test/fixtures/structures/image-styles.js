import faker from "faker";
import random from "lodash/random";

const imageStyles = () => {
  const square = faker.image.image(200, 200);
  const landscape = faker.image.image(320, 200);
  const portrait = faker.image.image(200, 300);
  const original = random(0, 100) > 50 ? portrait : landscape;
  return {
    original,
    small: original,
    smallSquare: square,
    smallLandscape: landscape,
    smallPortrait: portrait,
    medium: original,
    mediumSquare: square,
    mediumLandscape: landscape,
    mediumPortrait: portrait,
    largeLandscape: landscape
  };
};

export default imageStyles;
