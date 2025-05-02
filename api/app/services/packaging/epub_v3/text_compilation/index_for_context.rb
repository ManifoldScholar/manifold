# frozen_string_literal: true

module Packaging
  module EpubV3
    module TextCompilation
      # Index the collection of {Packaging::EpubV3::TextSectionItem text section items} into
      # the {Packaging::EpubV3::PackageContext context}.
      class IndexForContext
        include ::Packaging::PipelineOperation

        # @param [Hash] state
        # @option state [Packaging::EpubV3::PackageContext] :package_context
        # @option state [<Packaging::EpubV3::TextSectionItem>] :text_sections
        # @return [void]
        def call
          state[:stylesheets].each do |item|
            state[:package_context].stylesheets << item
          end

          state[:text_sections].each do |item|
            state[:package_context].text_sections << item
          end

          Success()
        end
      end
    end
  end
end
