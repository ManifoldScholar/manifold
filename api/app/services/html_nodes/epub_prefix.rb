module HTMLNodes
  class EpubPrefix < Types::FlexibleStruct
    include Dry::Equalizer.new(:name)

    attribute :name, Types::Strict::String
    attribute :url, Types::HTTP_URI

    def to_s
      "#{name}: #{url}"
    end
  end
end
