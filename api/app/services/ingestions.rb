module Ingestions
  class IngestionError < StandardError; end

  mattr_accessor :configuration do
    Ingestions::Configuration::GlobalConfigurator.new
  end

  class << self
    delegate :configure, :strategies, :converters, :fetchers, to: :configuration
  end

  configure do
    fetchers do
      fetcher :google_doc
      fetcher :URL
    end

    converters do
      converter :markdown
      converter :HTML
      converter :latex
      converter :ms_word
    end

    strategies do
      strategy :epub
      strategy :manifest
      strategy :document
    end
  end
end
