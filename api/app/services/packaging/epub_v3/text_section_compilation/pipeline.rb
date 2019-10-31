module Packaging
  module EpubV3
    module TextSectionCompilation
      # This pipeline will compile a {TextSection} into a {Packaging::EpubV3::TextSectionItem}.
      class Pipeline
        include Packaging::EpubV3::PipelinedTransaction

        step :prepare!, with: "text_section_compilation.prepare"

        pipe_into :extract_stylesheets!, with: "text_section_compilation.extract_stylesheets",
          target: :stylesheets

        pipe :build_initial_html!, with: "text_section_compilation.build_initial_html"

        pipe_into :find_references!, with: "text_section_compilation.find_references",
          target: :referenced_items

        pipe_into :extract_remote_resources!, with: "text_section_compilation.extract_remote_resources",
          target: :remote_resources

        pipe :insert_stylesheet_references!, with: "text_section_compilation.insert_stylesheet_references"

        step :finalize!, with: "text_section_compilation.finalize"
      end
    end
  end
end
