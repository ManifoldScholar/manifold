module Ingestions
  class PreProcessor < AbstractInteraction
    hash :manifest, strip: false

    def execute
      preprocess_manifest!

      preprocess_build_files!

      manifest
    end

    private

    def preprocess_manifest!
      manifest.merge! compose PreProcessors::ExtractStylesheets
    end

    def preprocess_build_files!
      compose PreProcessors::ExtractTextSectionBodies
    end
  end
end
