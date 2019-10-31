module Packaging
  module EpubV3
    module TextCompilation
      # Compile the accumulated state from the previous steps into
      # a {Packaging::EpubV3::CompiledText finalized text proxy}.
      class Finalize
        include Dry::Transaction::Operation

        # @param [Hash] state
        # @option state [<Packaging::EpubV3::CollaboratorItem>] :collaborators
        # @option state [Packaging::EpubV3::PackageContext] :package_context
        # @option state [<Packaging::EpubV3::GroupedReferencedItem>] :referenced_items
        # @option state [<Packaging::EpubV3::StylesheetItem>] :stylesheets
        # @option state [Text] :text
        # @option state [<Packaging::EpubV3::TextSectionItem>] :text_sections
        # @option state [<Packaging::EpubV3::TitleItem>] :titles
        # @return [Dry::Types::Result(Packaging::EpubV3::CompiledText)]
        def call(state)
          state[:namespace_set] = state[:text_sections].reduce(HTMLNodes::NamespaceSet.new) do |ns, text_section|
            ns | text_section.namespace_set
          end

          Success(Packaging::EpubV3::CompiledText.new(state))
        end
      end
    end
  end
end
