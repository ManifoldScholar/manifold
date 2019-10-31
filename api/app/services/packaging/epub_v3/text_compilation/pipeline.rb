module Packaging
  module EpubV3
    module TextCompilation
      # This pipeline will compile a {Text} into a {Packaging::EpubV3::CompiledText}.
      class Pipeline
        include Packaging::EpubV3::PipelinedTransaction

        step :prepare!, with: "text_compilation.prepare"

        batch_map_state :compile_text_sections!, with: "text_section_compilation.pipeline",
          source: ->(state) { state[:text].text_sections.includes(:stylesheets) },
          target: :text_sections

        pipe_into :extract_stylesheets!, with: "text_compilation.extract_stylesheets",
          target: :stylesheets

        pipe_into :calculate_fingerprint, with: "text_compilation.calculate_fingerprint",
          target: :fingerprint

        pipe :extract_collaborators!, with: "text_compilation.extract_collaborators"

        pipe :extract_titles!, with: "text_compilation.extract_titles"

        pipe_into :group_referenced_items!, with: "text_compilation.group_referenced_items",
          target: :referenced_items

        pipe_into :extract_remote_resources!, with: "text_compilation.extract_remote_resources",
          target: :remote_resources

        pipe :extract_and_remap_ingestion_sources!, with: "text_compilation.extract_and_remap_ingestion_sources"

        pipe :link_external_sources!, with: "text_compilation.link_external_sources"

        pipe :index_for_context!, with: "text_compilation.index_for_context"

        pipe :remap_text_section_links!, with: "text_compilation.remap_text_section_links"

        step :finalize!, with: "text_compilation.finalize"
      end
    end
  end
end
