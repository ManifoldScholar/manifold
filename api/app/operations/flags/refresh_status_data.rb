# frozen_string_literal: true

module Flags
  # @see Flag
  # @see FlagStatus
  # @see FlaggableResource
  class RefreshStatusData
    include Dry::Monads[:result, :do]
    include QueryOperation

    BASE_QUERY = <<~SQL
    WITH flag_status_data AS (
      SELECT
        fl.id AS flaggable_id,
        fd.flagger_ids,
        fd.flags_count,
        fd.resolved_flags_count,
        fd.unresolved_flags_count
      FROM %<table_name>s fl
      LEFT OUTER JOIN flag_statuses fs ON fs.flaggable_type = %<flaggable_type>s AND fs.flaggable_id = fl.id
      LEFT JOIN LATERAL (
        SELECT
          COALESCE(fs.flagger_ids, '{}'::uuid[]) AS flagger_ids,
          COALESCE(fs.flags_count, 0) AS flags_count,
          COALESCE(fs.resolved_flags_count, 0) AS resolved_flags_count,
          COALESCE(fs.unresolved_flags_count, 0) AS unresolved_flags_count
      ) fd ON true
      WHERE
      (
        fl.flagger_ids IS DISTINCT FROM fd.flagger_ids
        OR
        fl.flags_count IS DISTINCT FROM fd.flags_count
        OR
        fl.resolved_flags_count IS DISTINCT FROM fd.resolved_flags_count
        OR
        fl.unresolved_flags_count IS DISTINCT FROM fd.unresolved_flags_count
      )
    )
    UPDATE %<table_name>s fl SET
      flagger_ids = fd.flagger_ids,
      flags_count = fd.flags_count,
      resolved_flags_count = fd.resolved_flags_count,
      unresolved_flags_count = fd.unresolved_flags_count
    FROM flag_status_data fd
    WHERE fd.flaggable_id = fl.id
    SQL

    # @param [Class<FlaggableResource>] flaggable_klass
    # @return [Dry::Monads::Success(Integer)]
    def call(flaggable_klass)
      query = with_sql_template BASE_QUERY, flaggable_klass.for_refresh_query

      Success sql_update!(query)
    end
  end
end
