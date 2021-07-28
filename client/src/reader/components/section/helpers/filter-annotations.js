class AnnotationsFilter {
  constructor(annotations, filters) {
    this.annotations = annotations;
    this.filters = filters;
    this.enabledGroups = Object.keys(this.filters.readingGroups).filter(id => {
      return this.filters.readingGroups[id] === true;
    });
    this.showYourPublicAnnotations =
      this.enabledGroups.length === 0 ||
      this.enabledGroups.includes("all") ||
      this.enabledGroups.includes("public");
    this.showYourPrivateAnnotations =
      this.enabledGroups.length === 0 ||
      this.enabledGroups.includes("all") ||
      this.enabledGroups.includes("private");
  }

  get showYourAnnotations() {
    return this.filters.annotation.yours;
  }

  get hideYourAnnotations() {
    return !this.showYourAnnotations;
  }

  get showYourHighlights() {
    return this.filters.highlight.yours;
  }

  get hideYourHighlights() {
    return !this.showYourHighlights;
  }

  get showOthersAnnotations() {
    return this.filters.annotation.others;
  }

  get hideOthersAnnotations() {
    return !this.showOthersAnnotations;
  }

  get showOthersHighlights() {
    return this.filters.highlight.others;
  }

  get hideOthersHighlights() {
    return !this.showOthersHighlights;
  }

  get showResources() {
    return this.filters.resource.all;
  }

  get hideResources() {
    return !this.showResources;
  }

  readingGroupIsHidden(readingGroupId) {
    if (this.enabledGroups.includes("all")) return false;
    return !this.enabledGroups.includes(readingGroupId);
  }

  get hideYourPublicAnnotations() {
    return !this.showYourPublicAnnotations;
  }

  get hideYourPrivateAnnotations() {
    return !this.showYourPrivateAnnotations;
  }

  filter() {
    if (!this.annotations) return [];
    return this.annotations.filter(annotation => {
      const {
        format,
        readingGroupId,
        currentUserIsCreator: isCreator,
        private: isPrivate
      } = annotation.attributes;
      const isHighlight = format === "highlight";
      const isAnnotation = format === "annotation";
      const isResource = format === "resource";
      const isInGroup = Boolean(readingGroupId);
      if (isHighlight && isCreator && this.hideYourHighlights) return false;
      if (isHighlight && !isCreator && this.hideOthersHighlights) return false;
      if (isAnnotation && isCreator && this.hideYourAnnotations) return false;
      if (isAnnotation && !isCreator && this.hideOthersAnnotations)
        return false;
      if (isResource && this.hideResources) return false;
      if (isInGroup && this.readingGroupIsHidden(readingGroupId)) return false;
      if (isPrivate && isCreator && this.hideYourPrivateAnnotations)
        return false;
      if (
        !isPrivate &&
        !readingGroupId &&
        isCreator &&
        this.hideYourPublicAnnotations
      )
        return false;
      return true;
    });
  }
}

function filterAnnotations(annotations, filters) {
  const annotationsFilter = new AnnotationsFilter(annotations, filters);
  const out = annotationsFilter.filter();
  return out;
}

export default filterAnnotations;
