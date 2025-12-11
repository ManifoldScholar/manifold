import { rgba } from "theme/styles/mixins";
import { theme } from "./variables";
import { textCode } from "./mixins";

export default `
  .errors-wrapper {
    padding: 10px 20px;
    margin: 20px;
    background: ${rgba(theme.delete, 0.1)};
    border: 2px solid ${theme.delete};
    border-radius: 4px;
    animation: scaleUp 0.5s;

    .error-wrapper {
      margin: 0 0 10px;
    }

    .errors {
      h4 {
        margin: 0;
        font-size: 14px;
        ${textCode()}
      }

      small {
        color: var(--errors-wrapper-errors-small-font-color);
      }
    }

    hgroup {
      display: flex;
      align-items: center;

      h4 {
        flex: 1;
        margin: 0;
        font-size: 20px;
        font-family: var(--font-family-sans);
      }
    }
  }

  @keyframes scaleUp {
    0% {
      opacity: 0;
      transform: scale(0.8);
    }

    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;
