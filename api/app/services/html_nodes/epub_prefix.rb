# frozen_string_literal: true

module HTMLNodes
  class EpubPrefix < Types::FlexibleStruct
    include Dry::Core::Equalizer.new(:name)

    attribute :name, Types::Strict::String
    attribute :url, Types::HTTP_URI

    def to_s
      "#{name}: #{url}"
    end
  end
end
