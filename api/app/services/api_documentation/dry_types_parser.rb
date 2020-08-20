module APIDocumentation
  class DryTypesParser
    class << self
      def convert(type)
        result = convert_base_type_structure(type)
        result = merge_meta_values(result, type) if contains_meta?(type)
        result = merge_enum_values(result, type) if contains_enum?(type)
        result
      end

      def read_only_attributes(hash)
        filter_attributes_by(hash, :read_only)
      end

      private

      def allowed_swagger_meta_types
        [
          :required,
          :example,
          :description
        ]
      end

      def filter_attributes_by(hash, search_key)
        values = hash.select do |_, value|
          contains_meta?(value) && value.meta.include?(search_key)
        end
        values.map { |k, _| k }
      end

      def convert_base_type_structure(type)
        return convert_complex_type(type) if multi_type?(type)

        convert_simple_type(type)
      end

      def convert_complex_type(type)
        return base_boolean if type?(type, :bool)

        convert(type.left).merge(convert(type.right))
      end

      def convert_simple_type(type)
        return convert_array_dry_type(type) if type?(type, :array)
        return convert_hash_dry_type(type) if type?(type, :hash)
        return base_float if type?(type, :float)
        return base_date_time if type?(type, :datetime)
        return base_null if type?(type, :nilclass)

        { type: type.name.downcase }
      end

      def merge_enum_values(hash, type)
        hash.merge(enum: type.values.map { |key, _| key })
      end

      def allowed_meta_values(type, allowed_swagger_meta_types)
        type.meta.select do |k, _|
          allowed_swagger_meta_types.include? k
        end
      end

      def add_description_for_uniqueness(converted_hash)
        converted_hash[:description] = (converted_hash[:description].to_s + " Must be unique.").strip
        converted_hash
      end

      def merge_meta_values(converted_hash, type)
        return_value = allowed_meta_values(type, allowed_swagger_meta_types)
        return_value = add_description_for_uniqueness(return_value) if type.meta.include? :unique
        converted_hash.merge(return_value)
      end

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
        type.respond_to? :left
      end

      def keys?(type)
        type.respond_to? :keys
      end

      def type?(type, sym)
        return boolean_type?(type) if sym == :bool

        type.name.downcase.to_sym == sym
      end

      def boolean_type?(type)
        return false unless multi_type?(type)
        return true if type?(type.left, :trueclass) && type?(type.right, :falseclass)

        false
      end

      def convert_hash_dry_type(type)
        if keys?(type)
          return {
            type: "object",
            properties: type.keys.map { |item| [item.name, convert(item.type)] }.to_h
          }
        end

        return { type: "object" }
      end

      def convert_array_dry_type(type)
        {
          type: "array",
          items: convert(type.type.member)
        }
      end

      def base_boolean
        { type: "boolean" }
      end

      def base_date_time
        { type: "string", format: "date-time" }
      end

      def base_float
        { type: "number", format: "float" }
      end

      def base_null
        { "x-nullable": true }
      end
    end
  end
end
