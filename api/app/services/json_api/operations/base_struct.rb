# frozen_string_literal: true

module JSONAPI
  module Operations
    # @abstract
    class BaseStruct < ::Types::FlexibleStruct
      transform_keys do |key|
        case key
        when /\Aatomic:operations\z/ then :operations
        else
          key.to_sym
        end
      end
    end
  end
end
