# frozen_string_literal: true

module Packaging
  module EpubV3
    module TextCompilation
      # This pipeline will compile a {Text} into a {Packaging::EpubV3::CompiledText}.
      class Pipeline
        include Packaging::EpubV3::PipelinedTransaction

        around :provide_state!, with: "utilities.provide_state"

        step :prepare!, with: "text_compilation.prepare"

        step :compile_text_sections!, with: "text_compilation.compile_text_sections"

        step :extract_stylesheets!, with: "text_compilation.extract_stylesheets"

        step :calculate_fingerprint, with: "text_compilation.calculate_fingerprint"

        step :extract_collaborators!, with: "text_compilation.extract_collaborators"

        step :extract_titles!, with: "text_compilation.extract_titles"

        step :group_referenced_items!, with: "text_compilation.group_referenced_items"

        step :extract_remote_resources!, with: "text_compilation.extract_remote_resources"

        step :extract_and_remap_ingestion_sources!, with: "text_compilation.extract_and_remap_ingestion_sources"

        step :link_external_sources!, with: "text_compilation.link_external_sources"

        step :index_for_context!, with: "text_compilation.index_for_context"

        step :remap_text_section_links!, with: "text_compilation.remap_text_section_links"

        step :finalize!, with: "text_compilation.finalize"
      end
    end
  end
end
