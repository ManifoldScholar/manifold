module Packaging
  module EpubV3
    module TextCompilation
      # Remap {ReferencedPathStrategy::TextSectionLink text section links}
      # within the referenced items.
      class RemapTextSectionLinks
        include Dry::Transaction::Operation

        # @param [Hash] state
        # @option state [Packaging::EpubV3::PackageContext] :package_context
        # @option state [<Packaging::EpubV3::GroupedReferencedItem>] :referenced_items
        # @return [void]
        def call(state)
          state[:referenced_items].select(&:text_section_link?).each do |item|
            referenced_section = state[:package_context].find_text_section_by_id item.text_section_id

            if referenced_section.blank?
              return Failure(
                [
                  :unknown_text_section,
                  "Cannot find referenced text section by id: #{item.text_section_id}"
                ]
              )
            end

            item.update_references_to! referenced_section.remapped_path
          end
        end
      end
    end
  end
end
