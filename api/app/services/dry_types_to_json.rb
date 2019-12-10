class DryTypesToJson
  class << self
    def convert(type)
      mapping = {}

      if type.respond_to?(:type)
        mapping[type] = set_simple_type(type)
      elsif type.respond_to?(:name) && split_multi_type(type).count > 1
        mapping[type] = set_nullable(type)
      end

      if type.respond_to?(:values)
        mapping[type] = mapping[type].merge({
          enum: type.values.map { |key, _| key }
        })
      end

      if type.respond_to?(:meta) && mapping[type]
        mapping[type] = mapping[type].merge(type.meta)
      end

      mapping[Dry::Types['date_time']] = base_date_time
      mapping[Dry::Types['bool']] = { type: 'boolean' }

      mapping[type] || type
    end

    private

    def set_simple_type(type)
      case type.name.downcase.to_sym
      when :array
        return set_array(type)
      when :hash
        return set_hash(type)
      when :float
        return base_float
      end

      { type: type.name.downcase }
    end

    def set_nullable(type)
      mapping = {}
      options = split_multi_type(type).map { |i| i.downcase.to_sym }
      nullable = options.delete(:nilclass)
      mapping[type] = { type: options[0].to_s }
      mapping[type] = mapping[type].merge(null_object) if nullable
      mapping[type] = mapping[type].merge(base_date_time) if options.include? :datetime
      mapping[type] = mapping[type].merge(base_float) if options.include? :float
      mapping[type]
    end

    def set_hash(type)
      if type.respond_to?(:keys)
        return {
          type: 'object',
          properties: type.keys.map { |item|
            [item.name, convert(item.type)]
          }.to_h
        }
      end

      return {}
    end

    def set_array(type)
      {
        type: 'array',
        items: convert(type.type.member)
      }
    end

    def split_multi_type(type)
      type.name.split(" | ")
    end

    def base_date_time
      { type: 'string', format: 'date-time' }
    end

    def base_float
      { type: 'number', format: 'float' }
    end

    def null_object
      { 'x-nullable': true }
    end
  end
end
