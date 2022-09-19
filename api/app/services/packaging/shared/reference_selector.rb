module Packaging
  module Shared
    # Represents a selector tuple that can point to a given resource.
    #
    # @see Ingestions::PostProcessors::TextSectionBody::URI_ATTRIBUTES
    class ReferenceSelector
      extend Dry::Initializer
      extend Memoist

      EXTERNAL_HREF_RESOURCE_TAGS = %w[image link].freeze

      param :tag, Types::String
      param :attribute, Types::String

      def can_refer_to_external_resource?
        case attribute
        when "src" then tag != "iframe"
        when "href" then tag.in?(EXTERNAL_HREF_RESOURCE_TAGS)
        when "poster" then tag == "video"
        else
          false
        end
      end

      # @!attribute [r] selector
      # CSS selector for use with Nokogiri
      # @return [String]
      memoize def selector
        "#{tag}[#{attribute}]"
      end
    end
  end
end
