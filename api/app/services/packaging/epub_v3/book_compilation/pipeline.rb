module Packaging
  module EpubV3
    module BookCompilation
      # This pipeline will compile a {Text} and all its dependent resources into an epub.
      class Pipeline
        include Packaging::EpubV3::PipelinedTransaction

        step :compile_text!, with: "text_compilation.pipeline"

        step :prepare!, with: "book_compilation.prepare"

        pipe :set_language!, with: "book_compilation.set_language"

        pipe :set_primary_identifier!, with: "book_compilation.set_primary_identifier"

        pipe :add_collaborators!, with: "book_compilation.add_collaborators"

        pipe :add_cover_image!, with: "book_compilation.add_cover_image"

        pipe :add_ingestion_sources, with: "book_compilation.add_ingestion_sources"

        pipe :add_stylesheets!, with: "book_compilation.add_stylesheets"

        pipe :add_text_sections!, with: "book_compilation.add_text_sections"

        pipe :add_titles!, with: "book_compilation.add_titles"

        pipe :add_remote_resources!, with: "book_compilation.add_remote_resources"

        pipe :generate_nav_item!, with: "book_compilation.generate_nav_item"

        step :finalize!, with: "book_compilation.finalize"
      end
    end
  end
end
