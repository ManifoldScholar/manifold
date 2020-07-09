module Packaging
  module EpubV3
    class GroupedReferencedItem < Types::FlexibleStruct
      include Dry::Equalizer.new(:path)

      attribute :path, Types.Instance(Packaging::Shared::ReferencedPath)
      attribute :references, Types::Array.of(Packaging::EpubV3::ReferencedItem)

      delegate :absolute_uri?, :external?, :derived_ingestion_source, :has_ingestion_source?, :ingestion_source_id,
               :text_section_id, :text_section_link?, to: :path

      def external_source?
        external? && references.any?(&:external_source?)
      end

      # @note Modifies the mutable nokogiri node
      # @see Packaging::EpubV3::ReferencedItem#node
      # @return [void]
      def update_references_to!(new_value)
        references.each do |reference|
          reference.value = new_value
        end
      end
    end
    # rubocop:enable
  end
end
