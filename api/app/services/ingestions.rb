module Ingestions
  mattr_accessor :configuration do
    Ingestions::Configuration::GlobalConfigurator.new
  end

  class << self
    delegate :configure, :strategies, :converters, to: :configuration
  end

  configure do
    converters do
      converter :markdown
      converter :google_doc
      converter :html
    end

    strategies do
      strategy :epub
      strategy :manifest
      strategy :document
    end
  end
end
