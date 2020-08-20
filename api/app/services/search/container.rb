module Search
  # Reusable definitions for search services.
  class Container
    include IntrospectiveContainer

    FIELD_DEFINITIONS = [
      { name: "title", raw_boost: 50.0 },
      { name: "full_text", raw_boost: 40.0 },
      { name: "makers", raw_boost: 30.0 },
      { name: "keywords", raw_boost: 30.0 },
      { name: "parent_keywords", raw_boost: 10.0 },
      { name: "content", nested_prefix: "text_nodes", raw_boost: 1.0, fuzzy_multiplier: 0.0 }
    ].freeze

    FIELD_PATHS = FIELD_DEFINITIONS.map do |definition|
      :"fields.#{definition[:name]}"
    end.freeze

    namespace :fields do
      FIELD_DEFINITIONS.each do |definition|
        register definition[:name].to_sym, memoize: true do
          ::Search::FieldInfo.new definition
        end
      end

      register :all, memoize: true do
        FIELD_PATHS.map { |path| self[path] }
      end
    end
  end
end
