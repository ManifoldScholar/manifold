# This class is responsible for determining which
# fetch (if any) should be used to fetch a url.
module Ingestions
  module Pickers
    # Unlike the other pickers, fetchers do not require a context filter, which is why
    # they do not extend the abstract interaction most of our other interactions extend.
    class Fetcher < ActiveInteraction::Base
      include Ingestions::Concerns::CatchesExceptions

      string :url

      def execute
        found = Ingestions.__send__(self.class.registry).detect do |definition|
          compose definition.interaction, test_only: true, url: url
        end

        found || none_found_error
      end

      private

      def none_found_error
        raise(
          Ingestions::Fetchers::NotFetchable,
          "No #{self.class.klass_name} found for #{url}"
        )
      end

      class << self
        def klass_name
          name.demodulize
        end

        def registry
          klass_name.pluralize.underscore
        end
      end

    end
  end
end
