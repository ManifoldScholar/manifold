module Ingestions
  mattr_accessor :configuration do
    Ingestions::Configuration::GlobalConfigurator.new
  end

  class << self
    delegate :configure, :strategies, :converters, :fetchers, to: :configuration
  end

  configure do
    fetchers do
      fetcher :google_doc
      fetcher :url
    end

    converters do
      converter :markdown
      converter :html
    end

    strategies do
      strategy :epub
      strategy :manifest
      strategy :document
    end
  end
end
