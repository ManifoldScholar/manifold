module Packaging
  module EpubV3
    class ReferencedItem < Types::FlexibleStruct
      attribute :node, Types.Instance(Nokogiri::XML::Element)
      attribute :path, Types.Instance(Packaging::Shared::ReferencedPath)
      attribute :selector, Types.Instance(Packaging::Shared::ReferenceSelector)

      delegate :absolute_uri?, :external?, to: :path
      delegate :can_refer_to_external_resource?, :tag, :attribute, to: :selector

      def external_source?
        external? && can_refer_to_external_resource?
      end

      # @return [Packaging::EpubV3::RemoteResourceItem, nil]
      def to_remote_resource
        return unless external_source?

        Packaging::EpubV3::RemoteResourceItem.new url: value
      end

      # @!attribute [rw] value
      # @return [String]
      def value
        node.attr(attribute)
      end

      # @param [String] new_value
      # @return [void]
      def value=(new_value)
        node.set_attribute(attribute, new_value)
      end
    end
  end
end
