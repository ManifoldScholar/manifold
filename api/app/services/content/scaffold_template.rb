module Content
  class ScaffoldTemplate
    DEFAULT = {
      "Content::RecentActivityBlock": {},
      "Content::TextsBlock": {},
      "Content::ResourcesBlock": {},
      "Content::MetadataBlock": {}
    }.freeze
    SIMPLE = { "Content::MetadataBlock": {} }.freeze
    ENHANCED = {
      "Content::RecentActivityBlock": {},
      "Content::TextsBlock": {},
      "Content::ResourcesBlock": {},
      "Content::MetadataBlock": {}
    }.freeze
    JOURNAL_SINGLE = {
      "Content::TableOfContentsBlock": {},
      "Content::ResourcesBlock": {},
      "Content::MetadataBlock": {}
    }.freeze
    JOURNAL_MULTI = {
      "Content::TextsBlock": { show_descriptions: true, show_authors: true },
      "Content::ResourcesBlock": {},
      "Content::MetadataBlock": {}
    }.freeze
    TEACHING_RESOURCE = {
      "Content::MarkdownBlock": {},
      "Content::RecentActivityBlock": {},
      "Content::TextsBlock": { show_descriptions: true, show_authors: true },
      "Content::ResourcesBlock": {},
      "Content::MetadataBlock": {}
    }.freeze
    REPORT = {
      "Content::TableOfContentsBlock": {},
      "Content::ResourcesBlock": {},
      "Content::MetadataBlock": {}
    }.freeze
    RESOURCES = {
      "Content::MarkdownBlock": {},
      "Content::ResourcesBlock": {}
    }.freeze

    def initialize(kind)
      @kind = kind
      @content_blocks = content_blocks_for_kind(kind).with_indifferent_access
    end

    attr_reader :kind
    attr_reader :content_blocks

    private

    def content_blocks_for_kind(kind)
      return DEFAULT unless kind.present?
      return self.class.const_get(kind.upcase) if self.class.const_defined?(kind.upcase)

      DEFAULT
    end

  end
end
