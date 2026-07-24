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
      position: relative;
      display: grid;
      grid-template-columns: 100%;
      margin-top: 20px;
      text-align: center;

      ${respond(`grid-template-columns: repeat(3, 1fr);`, 95)}

      &:has(.tab-default[aria-selected="false"]:hover) .section.color,
      &:has(.tab-custom[aria-selected="false"]:hover) .section.upload {
        --_border-color: var(--color-neutral-text-extra-light);
        z-index: 1;
      }

      .section {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding: 30px 10px;
        border: 1px solid var(--_border-color, var(--color-neutral-ui-dull-light));
        transition-property: border-color;
        transition-duration: var(--transition-duration-default);

        ${respond(
          `
            padding-top: 25px;
            padding-bottom: 10px;
            margin: 0;
          `,
          95
        )}

        &.active {
          --_border-color: var(--color-interaction-light);

        }

        &.color {
          margin-block-start: -1px;

          ${respond(
            `
              margin-block-start: 0;
              margin-inline-start: -1px;
            `,
            95
          )}
        }
      }

      .tablist {
        display: contents;

        .label {
          position: absolute;
          z-index: 2;
          padding: 0;
          margin: 0;

          &[aria-selected="true"] {
            inset-block-start: var(--_tab-offset);
            inset-inline: 11px;
          }

          /* Stretching the unselected tab across the section's grid area
             makes the whole box a click target for it. */
          &[aria-selected="false"] {
            inset: 0;
            align-items: flex-start;
            padding-block-start: var(--_tab-offset);
          }
        }
      }

      .tab-default {
        --_tab-offset: 30px;

        grid-area: 2 / 1 / 3 / 2;

        ${respond(
          `
            --_tab-offset: 26px;

            grid-area: 1 / 2 / 2 / 3;
          `,
          95
        )}
      }

      .tab-custom {
        --_tab-offset: 31px;

        grid-area: 3 / 1 / 4 / 2;

        ${respond(
          `
            --_tab-offset: 26px;

            grid-area: 1 / 3 / 2 / 4;
          `,
          95
        )}
      }

      .spacer {
        visibility: hidden;
      }

      .section-inner {
        transition: opacity var(--transition-duration-default) var(--transition-timing-function);

        &[inert] {
          opacity: 0.4;
        }
      }

      .label {
        ${sectionLabel}
        display: block;
        margin-bottom: 1.625em;

        &:where(button) {
          display: flex;
          gap: .25rem;
          align-items: center;
          justify-content: center;
          background: transparent;
          border-color: transparent;
        }

        &[aria-selected="true"] {
          color: var(--color-interaction-light);
          cursor: default;
        }

        &[aria-selected="false"]:hover {
          color: var(--color-neutral-text-extra-light);
        }
      }
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
        .color-picker {
          display: flex;
          flex-direction: column;
          flex-grow: 2;
          align-items: center;
          justify-content: space-between;
          padding: 15px;

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

      .upload {
        position: relative;

        &::after {
          ${sectionLabel}
          position: absolute;
          top: 0;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1;
          width: 50px;
          height: 26px;
          font-size: 14px;
          line-height: 26px;
          content: "Or";
          background-color: var(--color-base-neutral90);

          ${respond(
            `
              top: 50%;
              left: 0;
              width: 26px;
              height: 100px;
              line-height: 100px;
            `,
            95
          )}
        }
      }
    }
  }
`;
