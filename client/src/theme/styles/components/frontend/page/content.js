import { respond } from "theme/styles/mixins";

const pageContentHeading = `
  font-family: var(--font-family-heading);
  margin-top: 0;
  color: var(--color-base-neutral80);

  ${respond(`margin-bottom: 38px;`, 60)}
`;

export default `
  .page-content,
  .markdown {
    font-family: var(--font-family-copy);
    font-size: 16px;
    line-height: 1.438;
    color: var(--color-base-neutral90);

    > * {
      margin-bottom: 0;
    }

    > * + * {
      margin-top: 30px;

      ${respond(`margin-bottom: 32px;`, 60)}
    }

    h1 {
      ${pageContentHeading}
      font-size: 32px;
      font-weight: var(--font-weight-semibold);
      hyphens: none;
      line-height: 1.188;
    }

    h2 {
      ${pageContentHeading}
      font-size: 30px;
      font-weight: var(--font-weight-medium);
      hyphens: none;
      line-height: 1.233;
    }

    h3 {
      ${pageContentHeading}
      font-size: 24px;
      font-weight: var(--font-weight-medium);
      line-height: 1.208;
    }

    h4 {
      ${pageContentHeading}
      font-size: 22px;
      font-weight: var(--font-weight-semibold);
      line-height: 1.273;
    }

    h5 {
      ${pageContentHeading}
      font-size: 18px;
      font-weight: var(--font-weight-semibold);
      line-height: 1.278;
    }

    h6 {
      ${pageContentHeading}
      font-size: 16px;
    }

    a {
      text-decoration-line: underline;

      &:visited {
        color: var(--color-accent-primary-dark);
      }
    }

    ol,
    ul {
      padding-left: 16px;
      list-style: none;

      li {
        padding-left: 22px;

        &::before {
          width: 16px;
          margin-left: -16px;
        }
      }
    }

    ol {
      counter-reset: styled-counter;

      li {
        counter-increment: styled-counter;

        &::before {
          font-family: var(--font-family-heading);
          margin-right: 11px;
          font-weight: var(--font-weight-medium);
          content: counter(styled-counter);
        }
      }
    }

    ul {
      li::before {
        margin-right: 11px;
        color: var(--color-accent-primary);
        content: "\\2022";
      }
    }
  }
`;
