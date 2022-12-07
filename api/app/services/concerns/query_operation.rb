# frozen_string_literal: true

# Methods for working directly with SQL queries in operations.
module QueryOperation
  extend ActiveSupport::Concern

  included do
    include Dry::Monads[:result]

    delegate :quote_column_name, to: :connection
  end

  # @param [<String>] parts
  # @return [void]
  def sql_select!(*parts)
    connection.exec_query compile_query(*parts)
  end

  alias sql_exec! sql_select!

  # @param [<String>] parts
  # @return [void]
  def sql_insert!(*parts)
    # We use exec_query instead of exec_insert,
    # because we want control over RETURNING
    connection.exec_query compile_query(*parts)
  end

  # @param [<String>] parts
  # @return [Integer]
  def sql_update!(*parts)
    connection.exec_update compile_query(*parts)
  end

  # @param [<String>] parts
  # @return [Integer]
  def sql_delete!(*parts)
    connection.exec_delete compile_query(*parts)
  end

  def arel_table_for(table_name)
    Arel::Table.new(table_name)
  end

  # @api private
  # @return [ActiveRecord::ConnectionAdapters::PostgreSQLAdapter]
  def connection
    ApplicationRecord.connection
  end

  # Join components of a query with the separator value in `join_with`.
  #
  # @param [<String>] parts
  # @param [String] join_with
  # @param [Boolean] prefix
  # @return [String]
  def compile_query(*parts, join_with: " ", prefix: false)
    compiled = parts.flatten.map(&:presence).compact.join(join_with).strip

    return compiled unless prefix && compiled.present?

    "#{join_with}#{compiled}"
  end

  # Join components of a query with ` AND `.
  #
  # @param [<String>] parts
  # @param [Boolean] prefix
  # @return [String]
  def compile_and(*parts, prefix: false)
    compile_query(*parts, join_with: " AND ", prefix: prefix)
  end

  # Provide the quoted model id as a formatting argument
  # to the `template`.
  #
  # @param [ApplicationRecord] model
  # @param [String] template
  # @return [String]
  def with_quoted_id_for(model, template)
    return "" if model.blank? || model.new_record?

    with_sql_template template, model.quoted_id
  end

  # @param [#to_s] prefix
  # @param [<String>, String] id_or_ids
  # @param [#to_s] column
  # @return [String]
  def with_quoted_id_or_ids_on(prefix, id_or_ids, column: :id)
    case id_or_ids
    when Types::UUIDList
      arel_table_for(prefix)[column].in(id_or_ids).to_sql
    when Types::UUID
      arel_table_for(prefix)[column].eq(id_or_ids).to_sql
    else
      ""
    end
  end

  # @param [String] template
  # @param [<Object>] values format values for `String#%`
  # @return [String]
  def with_sql_template(template, *values)
    formatted = template % values

    cleanup_query formatted
  end

  private

  # @param [String] sql
  # @return [String]
  def cleanup_query(sql)
    sql.strip_heredoc.squish
  end
end
