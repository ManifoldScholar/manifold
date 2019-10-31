module Packaging
  module EpubV3
    module TextCompilation
      # Index the collection of {Packaging::EpubV3::TextSectionItem text section items} into
      # the {Packaging::EpubV3::PackageContext context}.
      class IndexForContext
        include Dry::Transaction::Operation

        # @param [Hash] state
        # @option state [Packaging::EpubV3::PackageContext] :package_context
        # @option state [<Packaging::EpubV3::TextSectionItem>] :text_sections
        # @return [void]
        def call(state)
          state[:stylesheets].each do |item|
            state[:package_context].stylesheets << item
          end

          state[:text_sections].each do |item|
            state[:package_context].text_sections << item
          end
        end
      end
    end
  end
end
