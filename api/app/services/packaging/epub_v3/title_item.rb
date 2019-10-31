module Packaging
  module EpubV3
    class TitleItem < Types::FlexibleStruct
      include Dry::Equalizer.new(:text_title_id)
      include Dux.comparable(:position)

      attribute :kind, Types::ENUM_OF_TYPE[TextTitleKind]
      attribute :language, Types::String
      attribute :text_title, Types.Instance(::TextTitle)

      delegate :id, :name, to: :text_title, prefix: true
      delegate :position, :value, to: :text_title

      # @return [(String, Hash)]
      def to_gepub_args
        [value, to_gepub_options]
      end

      # @return [Hash]
      def to_gepub_options
        {}.tap do |h|
          h[:lang] = language if language.present?
        end
      end
    end
  end
end
