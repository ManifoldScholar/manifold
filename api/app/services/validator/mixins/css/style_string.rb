module Validator
  module Mixins
    module Css
      # Mixin containing methods for working with CSS inline style strings.
      module StyleString
        def to_css_value_and_unit(value)
          units = %w(em ex % px cm mm in pt pc)
          return value if units.any? { |unit| value.include? unit }
          "#{value.to_i}px"
        end

        def css_value_map(value)
          map = Validator::Constants::CSS_VALUE_MAP
          return value unless map.key?(value.downcase)
          map[value.downcase]
        end

        def hash_to_style_string(styles_hash)
          styles = []
          styles_hash.each { |key, value| styles.push("#{key}: #{value}") }
          styles.join("; ")
        end

        # rubocop:disable Style/EachWithObject
        def style_string_to_hash(style_string)
          return {} if style_string.nil?
          style_string.split(";").map(&:strip).inject({}) do |out, declaration|
            property, value = declaration.split(":").map(&:strip)
            out[property] = value
            out
          end
        end
      end
    end
  end
end
