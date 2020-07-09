module Content
  class ScaffoldTemplate

    DEFAULT = ActiveSupport::OrderedHash.new
    DEFAULT["Content::RecentActivityBlock"] = {}
    DEFAULT["Content::TextsBlock"] = {}
    DEFAULT["Content::ResourcesBlock"] = {}
    DEFAULT["Content::MetadataBlock"] = {}
    DEFAULT.freeze

    SIMPLE = ActiveSupport::OrderedHash.new
    SIMPLE["Content::MetadataBlock"] = {}
    SIMPLE.freeze

    ENHANCED = ActiveSupport::OrderedHash.new
    ENHANCED["Content::RecentActivityBlock"] = {}
    ENHANCED["Content::TextsBlock"] = {}
    ENHANCED["Content::ResourcesBlock"] = {}
    ENHANCED["Content::MetadataBlock"] = {}
    ENHANCED.freeze

    JOURNAL_SINGLE = ActiveSupport::OrderedHash.new
    JOURNAL_SINGLE["Content::TableOfContentsBlock"] = {}
    JOURNAL_SINGLE["Content::ResourcesBlock"] = {}
    JOURNAL_SINGLE["Content::MetadataBlock"] = {}
    JOURNAL_SINGLE.freeze

    JOURNAL_MULTI = ActiveSupport::OrderedHash.new
    JOURNAL_MULTI["Content::TextsBlock"] = { show_descriptions: true, show_authors: true }
    JOURNAL_MULTI["Content::ResourcesBlock"] = {}
    JOURNAL_MULTI["Content::MetadataBlock"] = {}
    JOURNAL_MULTI.freeze

    TEACHING_RESOURCE = ActiveSupport::OrderedHash.new
    TEACHING_RESOURCE["Content::MarkdownBlock"] = {}
    TEACHING_RESOURCE["Content::RecentActivityBlock"] = {}
    TEACHING_RESOURCE["Content::TextsBlock"] = { show_descriptions: true, show_authors: true }
    TEACHING_RESOURCE["Content::ResourcesBlock"] = {}
    TEACHING_RESOURCE["Content::MetadataBlock"] = {}
    TEACHING_RESOURCE.freeze

    REPORT = ActiveSupport::OrderedHash.new
    REPORT["Content::TableOfContentsBlock"] = {}
    REPORT["Content::ResourcesBlock"] = {}
    REPORT["Content::MetadataBlock"] = {}
    REPORT.freeze

    RESOURCES = ActiveSupport::OrderedHash.new
    RESOURCES["Content::MarkdownBlock"] = {}
    RESOURCES["Content::ResourcesBlock"] = {}
    RESOURCES.freeze

    ONE_TEXT = ActiveSupport::OrderedHash.new
    ONE_TEXT["Content::TableOfContentsBlock"] = {}
    ONE_TEXT.freeze

    def initialize(kind)
      @kind = kind
      @content_blocks = content_blocks_for_kind(kind).with_indifferent_access
    end

    attr_reader :kind, :content_blocks

    private

    def content_blocks_for_kind(kind)
      return DEFAULT unless kind.present?
      return self.class.const_get(kind.upcase) if self.class.const_defined?(kind.upcase)

      DEFAULT
    end

  end
end
