import {
  respond,
  defaultTransitionProps,
  listUnstyled
} from "theme/styles/mixins";

const firstLevelPadding = "1em";
const nestedLevelPadding = "1.611em";
const borderStyle = "1px solid var(--color-base-neutral40)";

const indents = [2, 3, 4, 5, 6].map(
  level => `&--depth-${level} {
  --link-indent: calc(${firstLevelPadding} + ${nestedLevelPadding} * (${level} - 1));
}`
);

export default `
/* A nested list of TOC nodes with an optional heading for the text. By default, nested node lists become progressively more indented. However, to allow links to span the entire width of the list, we indent the links themselves using var(--link-indent) where CSS custom properties are supported. Then, the value of --link-indent is updated within the scope of each depth level. */

.toc-block {
  --link-indent: ${firstLevelPadding};

  font-family: var(--font-family-heading);
  line-height: 1.278;
  color: var(--color-base-neutral90);

  &__heading {
    padding-top: 20px;
    padding-bottom: 22px;
    margin-top: 0;
    margin-bottom: 0;
    border-top: 1px solid var(--color-base-neutral40);
  }

  &__text-title {
    padding-right: 0.636em;
    font-size: 19px;
    font-weight: var(--font-weight-medium);

    ${respond(`font-size: 22px;`, 60)}
  }

  &__text-subtitle {
    font-family: var(--font-family-copy);
    display: inline-block;
    font-size: 17px;
    font-style: italic;
    font-weight: var(--font-weight-regular);
    letter-spacing: 0.017em;

    ${respond(`font-size: 20p`, 60)}
  }

  &__list {
    ${listUnstyled}
    padding-left: ${firstLevelPadding};
    font-size: 16px;

    ${respond(`font-size: 18px;`, 60)}

    @supports (padding: var(--link-indent)) {
      padding-left: 0;

      /* create values for --link-indent scoped to depth-based class names */
      ${indents}
    }

    &--depth-1 {
      padding-top: 20px;
      padding-bottom: 20px;
      border-top: ${borderStyle};
      border-bottom: ${borderStyle};
    }


    &--large {
      padding-top: min(3.75vw, 30px);
      padding-bottom: min(3.75vw, 30px);
      font-weight: var(--font-weight-medium);

      ${respond(`font-size: 20px;`, 80)}

      .toc-block__node + .toc-block__node {
        margin-top: min(1.25vw, 10px);
      }
    }
  }

  &__node {
    > .toc-block__list {
      padding-left: ${firstLevelPadding} * 1.5;

      @supports (padding: var(--link-indent)) {
        padding-left: 0;
      }
    }
  }

  &__link {
    display: block;
    padding-top: 0.444em;
    padding-bottom: 0.5em;
    padding-left: var(--link-indent, ${nestedLevelPadding});
    color: inherit;
    text-decoration: none;
    transition: color ${defaultTransitionProps},
      background-color ${defaultTransitionProps};

    &:hover,
    &:focus-visible {
      background-color: var(--color-accent-primary-off-white);
    }
  }

  &__node-creator {
    font-family: var(--font-family-copy);
    padding-left: 0.889em;
    letter-spacing: 0.015em;
  }

  &__from-title {
    margin-left: 6px;
    color: var(--color);
    transition: color ${defaultTransitionProps};

    .toc-block__link:hover & {
      color: inherit;
    }
  }
}
`;
