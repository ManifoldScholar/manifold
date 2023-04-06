module Ingestions
  module TextSection
    class PreProcessor < Ingestions::AbstractInteraction
      hash :manifest, strip: false

      def execute
        preprocess_manifest!
        preprocess_build_files!
        manifest
      end

      private

      def preprocess_manifest!
        manifest.merge! compose Ingestions::PreProcessors::ExtractStylesheets
      end

      def preprocess_build_files!
        compose Ingestions::PreProcessors::ExtractTextSectionBodies
      end
    end
  end
end
