const gap = "30px";

export default `
  .group-settings-form {
    margin-top: ${gap};

    input,
    .instructions {
      color: var(--strong-color);
    }

    &__course-radios,
    &__date-picker-section {
      padding-bottom: 20px;
    }

    &__date-picker-group {
      display: grid;
      grid-template-columns: repeat(auto-fit, 245px);
      grid-gap: ${gap};
      padding-bottom: 20px;
    }
  }
`;
