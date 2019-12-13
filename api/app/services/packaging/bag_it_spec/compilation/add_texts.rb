module Packaging
  module BagItSpec
    module Compilation
      # Add a {Text} (via {Packaging::BagItSpec::TextProxy proxy}) to the bagit archive
      # as an epub, along with any metadata about the text itself.
      class AddTexts
        include Packaging::PipelineOperation

        # @param [Packaging::BagItSpec::Context] context
        # @param [<Packaging::BagItSpec::TextProxy>] texts
        # @param [Hash] state
        # @return [void]
        def call(bag:, texts:, **_state)
          texts.each do |text|
            text.entries.each_value do |entry|
              entry.add_to! bag
            end
          end
        end
      end
    end
  end
end
