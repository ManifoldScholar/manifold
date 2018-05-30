module Ingestor
  module Preprocessor
    module HTML
      class HeaderIds
        attr_accessor :document, :header_nodes

        def init_state(markup)
          @document = Nokogiri(markup)
          @header_nodes = document.xpath("//h1 | //h2 | //h3 | //h4 | //h5 | //h6")
        end

        def run(markup)
          init_state(markup)

          header_nodes.each do |node|
            next if node["id"]
            node["id"] = Digest::MD5.hexdigest(node.name + node.text)
          end

          document.to_s
        end

      end
    end
  end
end
