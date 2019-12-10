module Packaging
  module BagItSpec
    module Compilation
      # Export a {Text} as an epub (or use its {TextExport already cached version}) and
      # wrap that in a {Packaging::BagItSpec::TextProxy proxy object} for further processing.
      #
      # @see Packaging::Exportation::ExportTextToEpubV3
      class PrepareText
        include Packaging::PipelineOperation

        # @param [Text] text
        # @return [Packaging::BagItSpec::TextProxy]
        # @return [Dry::Monads::Failure] if epub compilation fails
        def call(text)
          Packaging::Exportation::ExportTextToEpubV3.run_as_monad(text: text) do |m|
            m.success do |text_export|
              Packaging::BagItSpec::TextProxy.new text, text_export
            end

            m.failure do |_code, reason|
              Failure(:epub_export_failed, reason)
            end
          end
        end
      end
    end
  end
end
