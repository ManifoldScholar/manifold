class DryTypesToJson
  class << self
    def convert(type)
      mapping = {}

      mapping[type] = convert_simple_dry_type(type) if single_type?(type)
      mapping[type] = convert_multi_type(type) if multi_type?(type)

      mapping[type] = merge_enum_values(mapping, type) if contains_enum?(type)
      mapping[type] = mapping[type].merge(type.meta) if contains_meta?(type)

      mapping = handle_edge_case_conversions(mapping)
      mapping[type] || type
    end

    private

    def single_type?(type)
      type.respond_to? :type
    end

    def contains_enum?(type)
      type.respond_to? :values
    end

    def contains_meta?(type)
      type.respond_to? :meta
    end

    def multi_type?(type)
      type.respond_to?(:name) && split_multi_type(type).count > 1
    end

    def handle_edge_case_conversions(mapping)
      mapping[Dry::Types["date_time"]] = base_date_time
      mapping[Dry::Types["bool"]] = { type: "boolean" }
      mapping
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
