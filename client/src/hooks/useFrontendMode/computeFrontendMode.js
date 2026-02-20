const buildProjectState = project => {
  if (!project) return null;
  return {
    id: project.id,
    slug: project.attributes.slug,
    title: project.attributes.title,
    titleFormatted: project.attributes.titleFormatted,
    subtitle: project.attributes.subtitle,
    subtitleFormatted: project.attributes.subtitleFormatted,
    darkMode: project.attributes.darkMode,
    heroStyles: project.attributes.heroStyles,
    standaloneModePressBarText: project.attributes.standaloneModePressBarText,
    standaloneModePressBarUrl: project.attributes.standaloneModePressBarUrl
  };
};

export default function computeFrontendMode({
  project,
  settings,
  searchParams,
  prevStandalone,
  isProjectHomepage
}) {
  const standaloneMode = project?.attributes?.standaloneMode ?? "disabled";
  const canShowStandalone = standaloneMode !== "disabled";
  const libraryDisabled = settings?.attributes?.general?.libraryDisabled;
  const allStandalone = settings?.attributes?.general?.allStandalone;
  const isEnforced = standaloneMode === "enforced";
  const modeRequested = searchParams?.get("mode") === "standalone";

  let isStandalone = false;
  if (libraryDisabled && allStandalone) isStandalone = true;
  else if (isEnforced) isStandalone = true;
  else if (canShowStandalone && prevStandalone) isStandalone = true;
  else if (canShowStandalone && modeRequested) isStandalone = true;

  return {
    isLibrary: !isStandalone,
    isStandalone,
    isProject: !!project,
    isProjectHomepage: isStandalone ? isProjectHomepage ?? false : false,
    project: project ? buildProjectState(project) : null
  };
}
