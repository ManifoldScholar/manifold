import { respond, textTruncate } from "theme/styles/mixins";

export default `
  .overlay-title {
    font-family: var(--font-family-sans);
    display: flex;
    align-items: center;
    padding: 0.85em 0;
    margin: 0;
    font-size: 22px;
    font-weight: var(--font-weight-medium);

    ${respond(`justify-content: center;`, 65)}

    &__icon {
      flex-shrink: 0;
      transform: translateY(1px);
    }

    &__text {
      ${textTruncate}
      margin-left: 10px;
    }
  }
`;
