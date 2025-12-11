import { formInstructions } from "theme/styles/mixins";

export default `
  .instructional-copy {
    display: block;
    ${formInstructions}

    &:not(:first-child) {
      margin-top: 0.75em;

      &.margin-top {
        margin-top: 30px;
      }
    }

    &:not(:last-child) {
      padding-bottom: 12px;
      margin-bottom: 15px;

      &.margin-bottom {
        margin-bottom: 30px;
      }
    }

    a {
      text-decoration-line: underline;
    }
  }
`;
