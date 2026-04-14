import { respond } from "theme/styles/mixins";

export default `
  .demo-animation {
    width: 150px;
    height: auto;

    ${respond(`width: 180px;`, 80)}
  }
`;
