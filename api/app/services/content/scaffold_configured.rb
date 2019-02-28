module Content
  class ScaffoldConfigured

    def initialize(configuration)
      @configuration = configuration
      @content_blocks = configured_blocks(configuration)
    end

    attr_reader :configuration, :content_blocks

    private

    def configured_blocks(config)
      {}.tap do |hash|
        config[:multiple_texts] ? hash["Content::TextsBlock"] = {} : hash["Content::TableOfContentsBlock"] = {}
        hash["Content::ResourcesBlock"] = {} if config[:resources]
        hash["Content::MarkdownBlock"] = {} if config[:markdown]
        hash["Content::RecentActivityBlock"] = {} if config[:recent_activity]
        hash["Content::MetadataBlock"] = {}
      end
    end
  end
end
