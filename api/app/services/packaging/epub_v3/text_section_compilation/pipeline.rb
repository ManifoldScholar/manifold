# frozen_string_literal: true

module Packaging
  module EpubV3
    module TextSectionCompilation
      # This pipeline will compile a {TextSection} into a {Packaging::EpubV3::TextSectionItem}.
      class Pipeline
        include Packaging::EpubV3::PipelinedTransaction

        around :provide_state!, with: "utilities.provide_state"

        step :prepare!, with: "text_section_compilation.prepare"

        step :extract_stylesheets!, with: "text_section_compilation.extract_stylesheets"

        step :build_initial_html!, with: "text_section_compilation.build_initial_html"

        step :find_references!, with: "text_section_compilation.find_references"

        step :extract_remote_resources!, with: "text_section_compilation.extract_remote_resources"

        step :insert_stylesheet_references!, with: "text_section_compilation.insert_stylesheet_references"

        step :finalize!, with: "text_section_compilation.finalize"
      end
    end
  end
end
