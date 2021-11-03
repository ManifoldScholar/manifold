import { textBody } from "./mixins";

export default `
  .dialog-ux {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9999;

    .backdrop-ux {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: var(--dialog-ux-backdrop-background-color);
    }

    .modal-ux {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 9999;
      width: 100%;
      min-width: 300px;
      max-width: 650px;
      background: var(--dialog-ux-modal-background-color);
      border: 1px solid var(--dialog-ux-modal-border-color);
      border-radius: 4px;
      box-shadow: 0 10px 30px 0 var(--dialog-ux-modal-box-shadow-color);
      transform: translate(-50%, -50%);
    }

    .modal-ux-content {
      max-height: 540px;
      padding: 20px;
      overflow-y: auto;

      p {
        margin: 0 0 5px;
        font-size: 12px;
        color: var(--dialog-ux-modal-content-font-color);
        ${textBody}
      }

      h4 {
        margin: 15px 0 0;
        font-size: 18px;
        font-weight: 600;
        font-family: var(--font-family-sans);
      }
    }

    .modal-ux-header {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid var(--dialog-ux-modal-header-border-bottom-color);

      .close-modal {
        padding: 0 10px;
        background: none;
        border: none;
        appearance: none;
      }

      h3 {
        flex: 1;
        padding: 0 20px;
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        font-family: var(--font-family-sans);
      }
    }
  }
`;
