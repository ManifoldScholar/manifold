module Content
  class ScaffoldConfigured

    def initialize(configuration)
      @configuration = configuration
      @content_blocks = configured_blocks(configuration)
    end

    attr_reader :configuration, :content_blocks

    private

    def configured_blocks(config)
      ActiveSupport::OrderedHash.new.tap do |hash|
        hash["Content::RecentActivityBlock"] = {} if config[:recent_activity]
        hash["Content::MarkdownBlock"] = {} if config[:markdown]
        config[:multiple_texts] ? hash["Content::TextsBlock"] = {} : hash["Content::TableOfContentsBlock"] = {}
        hash["Content::ResourcesBlock"] = {} if config[:resources]
        hash["Content::MetadataBlock"] = {}
      end
    end
  end
end
