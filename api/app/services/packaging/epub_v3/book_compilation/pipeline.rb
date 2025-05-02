# frozen_string_literal: true

module Packaging
  module EpubV3
    module BookCompilation
      # This pipeline will compile a {Text} and all its dependent resources into an epub.
      class Pipeline
        include Packaging::EpubV3::PipelinedTransaction

        around :provide_state!, with: "utilities.provide_state"

        step :compile_text!, with: "text_compilation.pipeline"

        step :prepare!, with: "book_compilation.prepare"

        step :set_language!, with: "book_compilation.set_language"

        step :set_primary_identifier!, with: "book_compilation.set_primary_identifier"

        step :add_collaborators!, with: "book_compilation.add_collaborators"

        step :add_cover_image!, with: "book_compilation.add_cover_image"

        step :add_ingestion_sources, with: "book_compilation.add_ingestion_sources"

        step :add_stylesheets!, with: "book_compilation.add_stylesheets"

        step :add_text_sections!, with: "book_compilation.add_text_sections"

        step :add_titles!, with: "book_compilation.add_titles"

        step :add_remote_resources!, with: "book_compilation.add_remote_resources"

        step :generate_nav_item!, with: "book_compilation.generate_nav_item"

        step :finalize!, with: "book_compilation.finalize"
      end
    end
  end
end
