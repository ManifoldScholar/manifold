class DryTypesToJson
  class << self
    def convert(type)
      mapping = {}

      if type.respond_to?(:type)
        mapping[type] = convert_simple_dry_type(type)
      elsif has_multi_types?(type)
        mapping[type] = convert_multi_type(type)
      end

      mapping[type] = merge_enum_values(mapping, type) if type.respond_to?(:values)
      mapping[type] = mapping[type].merge(type.meta) if type.respond_to?(:meta)

      mapping[Dry::Types["date_time"]] = base_date_time
      mapping[Dry::Types["bool"]] = { type: "boolean" }

      mapping[type] || type
    end

    private

    def has_multi_types?(type)
      type.respond_to?(:name) && split_multi_type(type).count > 1
    end

    def convert_simple_dry_type(type)
      case type.name.downcase.to_sym
      when :array
        return convert_array_dry_type(type)
      when :hash
        return convert_hash_dry_type(type)
      when :float
        return base_float
      end

      { type: type.name.downcase }
    end

    def convert_multi_type(type)
      mapping = {}
      options = split_multi_type(type).map { |i| i.downcase.to_sym }
      nullable = options.delete(:nilclass)
      mapping[type] = { type: options[0].to_s }
      mapping[type] = mapping[type].merge(null_object) if nullable
      mapping[type] = mapping[type].merge(base_date_time) if options.include? :datetime
      mapping[type] = mapping[type].merge(base_float) if options.include? :float
      mapping[type]
    end

    def merge_enum_values(mapping, type)
      mapping[type].merge(enum: type.values.map { |key, _| key })
    end

    def convert_hash_dry_type(type)
      if type.respond_to?(:keys)
        return {
          type: "object",
          properties: type.keys.map { |item| [item.name, convert(item.type)] }.to_h
        }
      end

      return {}
    end

    def convert_array_dry_type(type)
      {
        type: "array",
        items: convert(type.type.member)
      }
    end

    def split_multi_type(type)
      type.name.split(" | ")
    end

    def base_date_time
      { type: "string", format: "date-time" }
    end

    def base_float
      { type: "number", format: "float" }
    end

    def null_object
      { "x-nullable": true }
    end
  end
end
