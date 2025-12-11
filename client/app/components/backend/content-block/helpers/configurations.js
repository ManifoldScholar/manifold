class Configurations {
  get configurationMap() {
    return {
      "Content::HeroBlock": true,
      "Content::RecentActivityBlock": false,
      "Content::TextsBlock": true,
      "Content::ResourcesBlock": true,
      "Content::MetadataBlock": false,
      "Content::TableOfContentsBlock": true,
      "Content::MarkdownBlock": true
    };
  }

  isConfigurable(type) {
    return this.configurationMap[type];
  }
}

export default new Configurations();
