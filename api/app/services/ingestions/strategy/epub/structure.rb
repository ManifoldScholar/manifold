require "redcarpet"

module Ingestions
  module Strategy
    module Epub
      # Inspects epub for structures
      class Structure

        def initialize(epub_inspector)
          @epub_inspector = epub_inspector
        end

        def toc
          structure = @epub_inspector.toc_inspector.text_structure
          structure[:toc]
        end

        def landmarks
          structure = @epub_inspector.toc_inspector.text_structure
          structure[:landmarks]
        end

        def page_list
          structure = @epub_inspector.toc_inspector.text_structure
          structure[:page_list]
        end

      end
    end
  end
end
