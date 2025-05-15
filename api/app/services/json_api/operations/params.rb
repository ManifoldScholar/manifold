# frozen_string_literal: true

module JSONAPI
  module Operations
    class Params < JSONAPI::Operations::BaseStruct
      attribute :operations, JSONAPI::Types::Array.of(JSONAPI::Operations::Operation)

      class << self
        # @param [ActionController::Params] params
        def parse(params)
          raw = params.respond_to?(:to_unsafe_h) ? params.to_unsafe_h : Hash(params)

          new raw
        end
      end
    end
  end
end
