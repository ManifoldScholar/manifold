module Packaging
  module EpubV3
    module TextCompilation
      # Set up the initial state for compiling a {Text}.
      class Prepare
        include Packaging::PipelineOperation

        # @param [Text] text
        # @return [Dry::Types::Result(Hash)]
        def call(text)
          build_state text: text do |state|
            state[:package_context] = Packaging::EpubV3::PackageContext.new text
          end
        end
      end
    end
  end
end
