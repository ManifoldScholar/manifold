# frozen_string_literal: true

module HTMLNodes
  class Namespace < Types::FlexibleStruct
    include Dry::Core::Equalizer.new(:name)

    attribute :name, Types::Strict::String
    attribute :url, Types::HTTP_URI
  end
end
