import React, { useContext } from "react";
import PropTypes from "prop-types";
import Breadcrumbs, {
  BreadcrumbsContext
} from "global/components/atomic/Breadcrumbs";
import {
  Text,
  Project,
  Journal,
  Issue,
  ProjectCollection,
  Base,
  Compact,
  Count,
  Analytics,
  Article,
  Resource
} from "./patterns";
import { maybeHtml } from "helpers/maybeHtml";
import * as Styled from "./styles";

const htmlRegex = /(<([^>]+)>)|(&#)|(&[a-z]*;)/gi;

const maybeString = title => {
  return typeof title === "string" && !title?.match(htmlRegex)?.length
    ? title
    : null;
};

const maybeComponent = title => (React.isValidElement(title) ? title : null);

const COMPONENT_MAP = {
  text: Text,
  project: Project,
  journal: Journal,
  issue: Issue,
  projectCollection: ProjectCollection,
  settings: Compact,
  analytics: Analytics,
  list: Compact,
  count: Count,
  article: Article,
  resource: Resource,
  resourceCollection: Resource,
  resources: Resource
};

export default function PageHeader({
  title,
  parentTitle,
  type,
  secondaryLinks,
  hideBreadcrumbs,
  ...props
}) {
  const { breadcrumbs } = useContext(BreadcrumbsContext) ?? {};

  const Type = COMPONENT_MAP[type] ?? Base;

  return (
    <Styled.Header>
      {breadcrumbs && !hideBreadcrumbs && (
        <Breadcrumbs backend breadcrumbs={breadcrumbs} />
      )}
      <Styled.Content>
        <Type
          titleComponent={maybeComponent(title)}
          titleString={maybeString(title)}
          titleHtml={maybeHtml(title)}
          parentTitleString={maybeString(parentTitle)}
          parentTitleHtml={maybeHtml(parentTitle)}
          hasSecondaryNav={!!secondaryLinks}
          type={type}
          {...props}
        />
        {secondaryLinks && <Styled.SecondaryNav links={secondaryLinks} />}
      </Styled.Content>
    </Styled.Header>
  );
}

PageHeader.displayName = "Layout.PageHeader";

PageHeader.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.object),
  note: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  icon: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  link: PropTypes.shape({ path: PropTypes.string, label: PropTypes.string }),
  type: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  subtitle: PropTypes.string
};
