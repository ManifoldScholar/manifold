class RemoveLegacyAttributeCaches < ActiveRecord::Migration[6.0]
  TABLES = {
    projects: %i[title subtitle],
    texts: %i[description],
    text_titles: %i[value],
  }.freeze

  def change
    TABLES.each do |table, attributes|
      reversible do |dir|
        dir.down do
          say_with_time "Reconstituting legacy cache fields for #{table}" do
            statement = build_assignment_statement table, attributes

            execute(<<~SQL.strip_heredoc.squish).cmdtuples
            UPDATE #{table} SET #{statement}
            SQL
          end
        end
      end

      attributes.each do |attribute|
        remove_column table, :"cached_#{attribute}_formatted", :text
        remove_column table, :"cached_#{attribute}_plaintext", :text
      end
    end
  end

  private

  def build_assignment_statement(table, attributes)
    arel_table = Arel::Table.new table

    assignments = attributes.flat_map do |attribute|
      legacy_columns = {
        formatted: :"cached_#{attribute}_formatted",
        plaintext: :"cached_#{attribute}_plaintext"
      }

      legacy_columns.map do |key, column|
        value = Arel::Nodes::NamedFunction.new("jsonb_extract_path_text", [
          arel_table[:fa_cache],
          Arel::Nodes.build_quoted(attribute.to_s),
          Arel::Nodes.build_quoted(key.to_s)
        ])

        arel_column = arel_table[column]

        target = Arel::Nodes::UnqualifiedColumn.new(arel_column)

        Arel::Nodes::Assignment.new(target, value)
      end
    end

    assignments.map(&:to_sql).join(", ")
  end
end
