module Packaging
  module EpubV3
    class StylesheetItem < Types::FlexibleStruct
      include Dry::Equalizer.new(:stylesheet_id)
      include Dux.comparable(:stylesheet_name)
      include Packaging::EpubV3::HasPath

      attribute :stylesheet, Types.Instance(::Stylesheet)

      delegate :id, :name, to: :stylesheet, prefix: true
      delegate :styles, to: :stylesheet

      def has_remote_resources?
        remote_resources.present?
      end

      # @!attribute [r] remote_resources
      # @return [<Packaging::EpubV3::RemoteResourceItem>]
      memoize def remote_resources
        tree.remote_resource_nodes.map do |node|
          RemoteResourceItem.new url: node.value
        end
      end

      # @return [StringIO]
      def to_io
        StringIO.new(styles)
      end

      # @return [Hash]
      memoize def tree
        Types::CrassTree.new children: Crass.parse(styles)
      end

      private

      def build_base_path
        "css/#{stylesheet_name}.css"
      end
    end
  end
end
