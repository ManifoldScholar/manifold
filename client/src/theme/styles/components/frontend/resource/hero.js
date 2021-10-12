import { respond, containerPrototype } from "theme/styles/mixins";

export default `
  .resource-hero-container {
    ${respond(containerPrototype, 60)}

    .overlay-full & {
      margin-top: 17px;

      ${respond(`margin-top: 40px;`, 60)}
    }
  }

  .resource-hero {
    position: relative;

    .resource-slide-figure {
      margin-bottom: 32px;

      ${respond(`margin-bottom: 40px;`, 50)}

      .overlay-full & {
        margin-bottom: 19px;
      }
    }
  }
`;
