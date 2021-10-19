export default `
  .analytics-list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    font-size: 20px;
    color: var(--color-base-neutral30);
    border-bottom: 1px solid var(--color-base-neutral80);
    break-inside: avoid;

    &__label {
      display: flex;
      align-items: center;

      h4 {
        margin: 0 0 0 15px;
        font-weight: var(--font-weight-regular);
      }
    }

    &__icon {
      flex-shrink: 0;
      color: var(--color-accent-secondary);
    }

    &__value {
      font-size: 32px;
      color: var(--color-accent-secondary);
    }
  }
`;
