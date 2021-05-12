module JSONAPI
  class ParseParams
    extend Dry::Initializer

    include Dry::Monads[:do, :result]

    param :params, Types::Hash

    option :attribute_parser, Types::Implements(Types::FlexibleStruct), optional: true

    option :type, Types::String.optional, optional: true, default: proc { nil }
    option :allow_blank_type, Types::Bool, optional: true, default: proc { true }

    def call
      normalized = yield normalize_params

      yield maybe_validate_type normalized

      Success normalized
    end

    private

    def normalize_params
      camelized = params.deep_transform_keys do |k|
        k.to_s.underscore.to_sym
      end

      parsed = params_struct.new(camelized)

      Success parsed.as_json.deep_symbolize_keys
    rescue Dry::Struct::Error, Dry::Types::CoercionError => e
      Failure[:cannot_parse, e.message]
    end

    def maybe_validate_type(normalized)
      data_type = normalized.dig(:data, :type)

      return Success(true) unless type.present? || data_type == type

      return Success(true) if allow_blank_type && data_type.blank?

      Failure[:mismatched_type, "Expected data of type: #{type.inspect}, got #{data_type.inspect}"]
    end

    def params_struct
      @params_struct ||= build_params_struct
    end

    def build_params_struct
      attribute_struct = attribute_parser || Types::Hash

      data_struct = Class.new(Types::FlexibleStruct).class_eval do
        attribute :attributes, attribute_struct
        attribute? :type, Types::String.optional
      end

      Class.new(Types::FlexibleStruct).class_eval do
        attribute :data, data_struct.default { { attributes: {}, type: nil } }
      end
    end
  end
end
