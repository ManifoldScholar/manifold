# frozen_string_literal: true

class MigrateSerializedAttributesToJSON < ActiveRecord::Migration[6.0]
  ARRAYS = %i[toc page_list landmarks].freeze
  HASHES = %i[structure_titles].freeze

  COLUMNS = (ARRAYS + HASHES).freeze
  MAPPING = COLUMNS.index_with { :"#{_1}_legacy" }

  def change
    drop_view :text_summaries, revert_to_version: 7

    MAPPING.each do |original, legacy|
      rename_column :texts, original, legacy
    end

    change_table :texts do |t|
      ARRAYS.each do |column|
        t.jsonb column, null: false, default: []
        # t.check_constraint <<~SQL.strip_heredoc.squish, name: :"text_#{column}_must_be_array"
        # jsonb_typeof(VALUE) = 'array'
        # SQL
      end

      HASHES.each do |column|
        t.jsonb column, null: false, default: {}
        # t.check_constraint <<~SQL.strip_heredoc.squish, name: "text_#{column}_must_be_object"
        # jsonb_typeof(VALUE) = 'object'
        # SQL
      end
    end

    reversible do |dir|
      dir.up do
        say_with_time "Migrating serialized YAML to JSONB" do
          columns = MAPPING.reduce([Text.arel_table[:id]]) do |cols, (original, legacy)|
            cols << Text.arel_table[legacy].as(original.to_s)
          end

          projection = Text.arel_table.project(*columns).to_sql

          selection = connection.select_all(projection)
          break 0 if selection.blank?

          columns = [:id, *COLUMNS]

          values = selection.map do |row|
            row.to_h.symbolize_keys.each_with_object({}) do |(key, value), h|
              case key
              when *COLUMNS
                h[key] = Text.arel_cast(load_yaml(value, key: key).to_json, "jsonb")
              when :id
                h[key] = Text.arel_cast(value, "uuid")
              else
                raise "unknown key: #{key}"
              end
            end.values_at(*columns).map(&:to_sql)
          end.map do |vals|
            "(#{vals.join(", ")})"
          end

          value_list = "VALUES #{values.join(", ")}"

          column_list = columns.map { connection.quote_column_name _1 }.join(", ")

          exec_update <<~SQL
          WITH conversions AS (
            SELECT #{column_list} FROM (#{value_list}) AS t(#{column_list})
          ) UPDATE texts t SET toc = c.toc, page_list = c.page_list, landmarks = c.landmarks, structure_titles = c.structure_titles
          FROM conversions c WHERE c.id = t.id;
          SQL
        end
      end
    end

    create_view :text_summaries, version: 7
  end

  private

  def load_yaml(value, key:)
    coerced =
      begin
        YAML.load value unless value.blank?
      rescue Psych::SyntaxError
        nil
      end

    if key.to_sym.in?(HASHES)
      Hash coerced
    else
      Array coerced
    end
  end
end
