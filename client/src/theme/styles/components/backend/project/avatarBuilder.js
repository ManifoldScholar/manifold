import { respond, fluidScale } from "theme/styles/mixins";

const sectionLabel = `
  font-size: 14px;
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.107em;
`;

const utilityMessage = `
  font-size: ${fluidScale("12px", "10px")};
  font-family: var(--font-family-sans);
  font-weight: 600;
  line-height: 1.533em;
  text-transform: uppercase;
  letter-spacing: 0.125em;
`;

export default `
  .avatar-builder {
    position: relative;

    .grid {
      display: flex;
      flex-direction: column;
      margin-top: 20px;
      text-align: center;

      ${respond(
        `
          flex-flow: row nowrap;
          justify-content: center;
        `,
        95
      )}

      .section {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding: 30px 10px;
        border: 1px solid var(--color-neutral-ui-dull-light);

        ${respond(
          `
            flex: 1;
            width: 33.33%;
            padding-top: 25px;
            padding-bottom: 10px;
            margin: 0;
            border: 1px solid var(--color-neutral-ui-dull-light);
            border-right: 0;
          `,
          95
        )}

        + .section {
          border: 1px solid var(--color-neutral-ui-dull-light);

          &.active {
            border-color: var(--color-interaction-light);
          }
        }
      }

      .label {
        ${sectionLabel}
        display: block;
        margin-bottom: 1.625em;
      }

      .current {
        padding-bottom: 45px;

        ${respond(`padding-bottom: 10px;`, 95)}

        .preview {
          display: block;
          width: 120px;
          height: 120px;
          margin: 0 auto;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;

          svg {
            width: 100%;
            height: auto;
          }
        }
      }

      .colors {
        .wrapper {
          width: 138px;
        }
      }

      .color {
        position: relative;

        .color-picker {
          display: flex;
          flex-direction: column;
          flex-grow: 2;
          align-items: center;
          justify-content: space-between;
          padding: 15px;

          &::after {
            ${sectionLabel}
            position: absolute;
            top: calc(100% - 13px);
            left: calc(50% - 25px);
            z-index: 1;
            width: 50px;
            height: 26px;
            font-size: 14px;
            line-height: 26px;
            content: "Or";
            background-color: var(--color-base-neutral90);

            ${respond(
              `
                top: calc(50% - 50px);
                right: -13px;
                left: auto;
                width: 26px;
                height: 100px;
                line-height: 100px;
              `,
              95
            )}
          }

          .default-description {
            ${utilityMessage}
            max-width: 150px;
            margin-top: 6px;
          }
        }
      }

      .contents-empty {
        margin-top: 0;
      }
    }
  }
`;
