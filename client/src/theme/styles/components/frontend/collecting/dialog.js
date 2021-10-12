const lateralPadding = `min(3.158vw, 24px)`;
const maxDialogHeight = `90vh`;
const maxListHeight = `220px`;

export default `
  .collecting-dialog {
    max-height: ${maxDialogHeight};
    overflow: auto;
    font-weight: var(--font-weight-regular);

    &__inner {
      padding-top: min(6.579vw, 50px);
      padding-right: min(1.974vw, 15px);
      padding-left: min(1.974vw, 15px);
    }

    &__header {
      display: flex;
      align-items: baseline;
      padding-right: ${lateralPadding};
      padding-left: ${lateralPadding};
    }

    &__header-icon {
      order: -1;
      margin-right: 16px;
      margin-left: -5px;
    }

    &__title {
      margin: 0;
      font-size: 20px;
      font-weight: var(--font-weight-regular);
      transform: translateY(-75%);
    }

    &__fieldset {
      padding: 0;
      margin: 0;
      margin-top: 28px;
      border: none;
    }

    &__checkbox-group {
      max-height: ${maxListHeight};
      margin-top: 10px;
      overflow: auto;
    }

    &__footer {
      padding-right: ${lateralPadding};
      padding-left: ${lateralPadding};
      margin-top: 50px;
    }

    &__close-button {
      width: 100%;
    }
  }
`;
