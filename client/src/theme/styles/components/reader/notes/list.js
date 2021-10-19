import { listUnstyled } from "theme/styles/mixins";

export default `
  .notes-list {
    ${listUnstyled}
    padding: 0;

    > li + li {
      padding-top: 43px;
    }
  }
`;
