module Packaging
  module BagItSpec
    module Compilation
      # Add a {Text} (via {Packaging::BagItSpec::TextProxy proxy}) to the bagit archive
      # as an epub, along with any metadata about the text itself.
      class AddTexts
        include Packaging::PipelineOperation

        # @param [Hash] state
        # @option state [Packaging::BagItSpec::Context] :context
        # @option state [<Packaging::BagItSpec::TextProxy>] :texts
        # @return [void]
        def call(state)
          bag = state[:context].bag

          state[:texts].each do |text|
            add_text_to! bag, text
          end
        end

        private

        # @param [BagIt::Bag] bag
        # @param [Packaging::BagItSpec::TextProxy] text
        # @return [void]
        def add_text_to!(bag, text)
          copy_file! bag, from: text.cover_asset_path, to: text.cover_path if text.has_cover?

          copy_file! bag, from: text.asset_path, to: text.epub_path
        end

        # @param [BagIt::Bag] bag
        # @param [String] from
        # @param [String] to
        # @param [String] open_mode
        # @return [void]
        def copy_file!(bag, from:, to:, open_mode: "rb")
          bag.add_file to do |output_file|
            File.open(from, open_mode) do |input_file|
              IO.copy_stream input_file, output_file
            end
          end
        end
      end
    end
  end
end
