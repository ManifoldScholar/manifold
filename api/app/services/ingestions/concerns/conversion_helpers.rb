module Ingestions
  module Concerns
    module ConversionHelpers
      extend ActiveSupport::Concern

      def ensure_header_ids!
        nodes = document_parsed.xpath("//h1 | //h2 | //h3 | //h4 | //h5 | //h6")
        nodes.each_with_index do |node, index|
          next if node["id"]

          node["id"] = Digest::MD5.hexdigest(index.to_s + node.name + node.text)
        end
      end
    end
  end
end
