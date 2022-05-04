module Packaging
  module EpubV3
    module TextSectionCompilation
      # Sets the `:document` key on the building state to a Nokogiri document
      # and populates it with the {TextSection}'s HTML content.
      #
      # @see Packaging::EpubV3::CompileNodeToXHTML
      class BuildInitialHTML
        include Dry::Transaction::Operation

        PAGE_TEMPLATE = <<~HTML.freeze
        <!doctype html>
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:xml="http://www.w3.org/XML/1998/namespace" xmlns:epub="http://www.idpf.org/2007/ops" epub:prefix="z3998: http://www.daisy.org/z3998/2012/vocab/structure/#, se: https://standardebooks.org/vocab/1.0">
          <head>
            <title></title>
          </head>
          <body class="manifold-text-section">
          </body>
        </html>
        HTML

        # @param [Hash] state
        # @option state [HTMLNodes::Node] :node
        # @return [void] should the HTML compilation succeed, it's void and continues with the state
        # @return [Dry::Monads::Result::Failure] should the interaction fail,
        #   this will return a failure and stop the pipeline.
        def call(state)
          document = Nokogiri::HTML(PAGE_TEMPLATE)

          state[:document] = document

          Packaging::EpubV3::CompileNodeToXHTML.run_as_monad parent: document.at_css("body"), node: state[:node]
        end
      end
    end
  end
end
