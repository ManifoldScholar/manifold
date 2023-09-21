# frozen_string_literal: true

module TextSections
  # Introspect the extrapolated nodes for a given text section.
  #
  # This is a test operation and not used in production.
  #
  # @api private
  class IntrospectNodes
    include Dry::Monads[:result]
    include QueryOperation

    FIRST_PART = TextSections::ExtrapolateNodes::FIRST_PART

    SECOND_PART = TextSections::ExtrapolateNodes::SECOND_PART

    FINAL_PART = <<~SQL
    SELECT * FROM finalized;
    SQL

    # @param [TextSection] text_section
    # @return [<Hash>]
    def call(text_section:)
      results = sql_select! FIRST_PART, interpolate(text_section: text_section), SECOND_PART, FINAL_PART

      coerce_all(results)
    end

    private

    def coerce_all(results)
      results.map do |result|
        coerce_result(result, column_types: results.column_types)
      end
    end

    def coerce_result(result, column_types:)
      result.each_with_object({}) do |(column, value), out|
        type = column_types.fetch(column)

        out[column.to_sym] = type.deserialize(value)
      end
    end

    def interpolate(text_section:, **)
      with_quoted_id_for text_section, <<~SQL
      AND text_sections.id = %s
      SQL
    end
  end
end
