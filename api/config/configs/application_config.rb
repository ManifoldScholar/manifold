# frozen_string_literal: true

require "anyway_config"
require "hashie"
# Base class for application config classes
class ApplicationConfig < Anyway::Config
  class ConfigMash < ::Hashie::Mash
    disable_warnings
  end

  class << self
    def config_mash
      lambda do |raw|
        ConfigMash.new(raw)
      end
    end

    private

    # Make it possible to access a singleton config instance
    # via class methods (i.e., without explictly calling `instance`)
    def respond_to_missing?(name, include_private = false)
      instance.respond_to?(name, include_private)
    end

    def method_missing(method, *args, &)
      instance.send(method, *args, &)
    end

    # Returns a singleton config instance
    def instance
      @instance ||= new
    end
  end
end
