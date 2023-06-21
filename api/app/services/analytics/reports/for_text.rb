module Analytics
  module Reports
    class ForText < Analytics::Reports::ScopedBuilder

      validate :resource_is_text!

      def resource_is_text!
        errors.add :resource, "must be a text" unless valid_resource.is_a?(Text)
      end

      register_base_cte! :visits, <<~SQL
        SELECT
          analytics_visits.id,
          analytics_visits.visit_token,
          analytics_visits.visitor_token,
          (analytics_visits.started_at #{TZ_PLACEHOLDER})::date AS started_on,
          (analytics_visits.ended_at #{TZ_PLACEHOLDER})::date AS ended_on,
          analytics_visits.started_at,
          analytics_visits.ended_at,
          analytics_events.name,
          analytics_events.properties,
          analytics_events.time
        FROM analytics_visits
        JOIN analytics_events
          ON analytics_visits.id = analytics_events.visit_id
        WHERE #{VISIT_DATE_PLACEHOLDER}
          AND analytics_events.name = '#{Analytics::Event.event_name_for(:view, Text)}'
          AND analytics_events.properties ->> '#{Text.model_name.param_key}' = #{RESOURCE_PLACEHOLDER}
        ORDER BY analytics_visits.started_at
      SQL

      register_base_cte! :date_range, <<~SQL
        SELECT
          d::date AS day
          FROM #{GENERATE_SERIES_PLACEHOLDER}
          ORDER BY 1
      SQL

      register_cte! :daily_visitors, <<~SQL
        SELECT
          dr.day AS x,
          COUNT(DISTINCT visitor_token) AS y
        FROM date_range dr
        LEFT OUTER JOIN visits ON dr.day = visits.started_on
        GROUP BY 1
        ORDER BY 1
      SQL

      register_cte! :annotation_counts, <<~SQL
        SELECT
          COUNT(*) FILTER (WHERE format = 'annotation' AND NOT private AND reading_group_id IS NULL) AS public_annotations,
          COUNT(*) FILTER (WHERE format = 'annotation' AND private AND reading_group_id IS NULL) AS private_annotations,
          COUNT(*) FILTER (WHERE format = 'annotation' AND reading_group_id IS NOT NULL) AS reading_group_annotations,
          COUNT(*) FILTER (WHERE format = 'highlight') AS highlights
        FROM annotations
        JOIN text_sections
          ON annotations.text_section_id = text_sections.id
        JOIN texts
          ON text_sections.text_id = texts.id
        WHERE #{timestamp_field_in_range('annotations.created_at')}
          AND texts.id = #{RESOURCE_PLACEHOLDER}
      SQL

      register_cte! :text_section_views, <<~SQL
        SELECT
          text_sections.id,
          text_sections.name,
          COUNT(*) AS count
        FROM (SELECT DISTINCT id FROM visits) visits
        JOIN analytics_events
          ON visits.id = analytics_events.visit_id
            AND analytics_events.name = '#{Analytics::Event.event_name_for(:view, TextSection)}'
        JOIN text_sections
          ON text_sections.id = (analytics_events.properties ->> '#{TextSection.model_name.param_key}')::uuid
        GROUP BY text_sections.id, text_sections.name
        ORDER BY count
      SQL

      register_cte! :shares, <<~SQL
        SELECT
          COUNT(*) AS count,
          analytics_events.properties ->> 'action' AS action
        FROM (SELECT DISTINCT id FROM visits) visits
        JOIN analytics_events
          ON visits.id = analytics_events.visit_id
        JOIN text_sections
          ON (analytics_events.properties ->> '#{TextSection.model_name.param_key}')::uuid = text_sections.id
        JOIN texts
          ON text_sections.text_id = texts.id
        WHERE analytics_events.name = '#{Analytics::Event.event_name_for(:share, TextSection)}'
          AND texts.id = #{RESOURCE_PLACEHOLDER}
        GROUP BY action
      SQL

      register_cte! :text_section_citations, <<~SQL
        SELECT
          COUNT(*) AS count
        FROM (SELECT DISTINCT id FROM visits) visits
        JOIN analytics_events
          ON visits.id = analytics_events.visit_id
        JOIN text_sections
          ON (analytics_events.properties ->> '#{TextSection.model_name.param_key}')::uuid = text_sections.id
        JOIN texts
          ON text_sections.text_id = texts.id
        WHERE analytics_events.name = '#{Analytics::Event.event_name_for(:cite, TextSection)}'
          AND texts.id = #{RESOURCE_PLACEHOLDER}
      SQL

      # END CTES

      # START ANALYTICS

      define_analytic :daily_visitors do
        require_cte! :daily_visitors

        build_agg_query(
          name: "daily_visitors",
          type: "xy",
          x_type: "date",
          y_type: "int",
          query_or_table_name: "daily_visitors",
          from: "daily_visitors"
        )
      end

      define_analytic :annotations do
        require_cte! :annotation_counts

        build_agg_query(
          name: "annotations",
          type: "json",
          array_content: "json",
          query_or_table_name: "annotation_counts",
          from: "annotation_counts"
        )
      end

      define_analytic :text_section_views do
        require_cte! :text_section_views

        build_agg_query(
          name: "text_section_views",
          type: "array",
          array_content: "json",
          query_or_table_name: "text_section_views",
          from: "text_section_views"
        )
      end

      define_analytic :shares do
        require_cte! :shares

        build_agg_query(
          name: "shares",
          type: "array",
          array_content: "json",
          query_or_table_name: "shares",
          from: "shares"
        )
      end

      define_analytic :citations do
        require_cte! :text_section_citations

        build_simple_query(
          name: "citations",
          type: "integer",
          value: "count",
          from: "text_section_citations"
        )
      end

      # END ANALYTICS

    end
  end
end
