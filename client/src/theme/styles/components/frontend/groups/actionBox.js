import {
  panelRounded,
  respond,
  utilityPrimary,
  subtitlePrimary
} from "theme/styles/mixins";

const basePaddingVertical = "24px";
const basePaddingLateral = "30px";
const gap = "12px";

export default `
  .group-action-box {
    ${panelRounded}
    padding: ${basePaddingVertical} ${basePaddingLateral};
    font-size: 14px;
    color: var(--strong-color);

    ${respond(
      `display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      padding-top: ${basePaddingVertical - gap});
      padding-left: ${basePaddingLateral - gap});

      > * {
        margin-top: ${gap};
        margin-left: ${gap};
      }`,
      65
    )}

    &__heading {
      flex-basis: 50%;
      flex-grow: 1;
    }

    &__heading-text {
      ${utilityPrimary};
      display: block;
      padding-bottom: 5px;
      font-size: inherit;

      ${respond(
        `display: inline-block;
      padding-right: 12px;`,
        65
      )}
    }

    &__instructions {
      ${subtitlePrimary};
      display: inline-block;
      padding-bottom: 25px;
      font-size: 18px;

      ${respond(`padding-bottom: 0;`, 65)}
    }
  }
`;
