module Packaging
  module EpubV3
    class RemoteResourceItem < Types::FlexibleStruct
      include Dry::Equalizer.new(:url)

      attribute :url, Types::HTTP_URI
      attribute? :external_source, Types.Instance(::CachedExternalSource)

      delegate :content_type, :has_asset?, to: :external_source, allow_nil: true

      def has_content_type?
        content_type.present?
      end

      def has_external_source?
        external_source.present?
      end

      # @return [Packaging::EpubV3::RemoteResourceItem]
      def with_external_source(external_source)
        self.class.new(attributes.merge(external_source: external_source))
      end
    end
  end
end
