module Packaging
  module BagItSpec
    module Compilation
      # This pipeline will compile a {Project} into a BagIt spec archive.
      class Pipeline
        include Packaging::BagItSpec::PipelinedTransaction

        step :prepare!, with: "compilation.prepare"

        batch_map_state :prepare_text!, with: "compilation.prepare_text",
          source: ->(state) { state[:context].published_texts },
          target: :texts

        pipe :add_texts!, with: "compilation.add_texts"

        pipe :write_metadata!, with: "compilation.write_metadata"

        pipe :build_manifest!, with: "compilation.build_manifest"

        pipe_into :build_archive!, with: "compilation.build_archive",
          target: :archive

        pipe :finalize!, with: "compilation.finalize"
      end
    end
  end
end
