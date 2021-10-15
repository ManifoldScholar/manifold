import {
  containerPrototype,
  utilityPrimary,
  respond
} from "theme/styles/mixins";

export default `
  .overlay-full-header {
    position: sticky;
    top: 0;
    justify-content: center;
    width: 100%;
    color: var(--strong-color);
    background-color: var(--box-bg-color);

    &__inner {
      ${containerPrototype}
      display: grid;
      grid-template: "middle end" auto / minmax(0, 1fr) auto;
      gap: 20px;
      align-items: center;
      min-height: 60px;

      ${respond(
        `grid-template: "start middle end" auto / 20% minmax(0, 1fr) 20%;`,
        40
      )}
    }

    &__start {
      display: none;
      grid-area: start;

      ${respond(`display: block;`, 40)}
    }

    &__middle {
      grid-area: middle;
      text-align: center;
    }

    &__end {
      grid-area: end;
      justify-self: end;
    }

    &__subtitle {
      ${utilityPrimary}
      font-size: 13px;
    }
  }
`;
