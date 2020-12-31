class RefactorFormattedAttributes < ActiveRecord::Migration[6.0]
  TABLES = {
    events: %i[],
    features: %i[],
    pages: %i[],
    projects: %i[title subtitle],
    project_collections: %i[],
    resources: %i[],
    resource_collections: %i[],
    settings: %i[],
    texts: %i[description],
    text_titles: %i[value],
  }.freeze

  def change
    TABLES.each do |(table, attributes)|
      add_fa_cache_for! table, attributes
    end
  end

  private

  def add_fa_cache_for!(table, attributes)
    add_column table, :fa_cache, :jsonb, default: {}, null: false

    return if attributes.blank?

    reversible do |dir|
      dir.up do
        arel_table = Arel::Table.new(table)

        args = attributes.flat_map do |attribute|
          attrs = {
            formatted: :"cached_#{attribute}_formatted",
            plaintext: :"cached_#{attribute}_plaintext"
          }

          value_args = attrs.flat_map do |(key, column)|
            attr = arel_table[column]
            coalesced = Arel::Nodes::NamedFunction.new "coalesce", [attr, Arel::Nodes.build_quoted("")]

            [Arel::Nodes.build_quoted(key.to_s), coalesced]
          end

          value = Arel::Nodes::NamedFunction.new("jsonb_build_object", value_args)

          [Arel::Nodes.build_quoted(attribute.to_s), value]
        end

        expr = Arel::Nodes::NamedFunction.new("jsonb_build_object", args)

        say_with_time "Populating #{table}.fa_cache" do
          execute(<<~SQL.strip_heredoc.squish).cmdtuples
          UPDATE #{table} SET fa_cache = #{expr.to_sql};
          SQL
        end
      end
    end
  end
end
