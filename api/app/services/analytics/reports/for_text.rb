module Analytics
  module Reports
    class ForText < Analytics::Reports::Builder

      record :subject, class: Text

      # BEGIN CTES

      register_base_cte! :text_visits, <<~SQL
        SELECT
          analytics_visits.id,
          analytics_visits.visit_token,
          analytics_visits.visitor_token,
          analytics_visits.started_at,
          analytics_visits.ended_at,
          analytics_events.name,
          analytics_events.properties,
          analytics_events.time
        FROM analytics_visits
        JOIN analytics_events
          ON analytics_visits.id = analytics_events.visit_id
        WHERE #{VISIT_DATE_PLACEHOLDER}
          AND analytics_events.name = 'view text'
          AND analytics_events.properties ->> 'text' = #{SUBJECT_PLACEHOLDER}
        ORDER BY analytics_visits.started_at
      SQL

      register_cte! :daily_text_visitors, <<~SQL
        SELECT
          started_at::date AS x,
          COUNT(DISTINCT visitor_token) AS y
        FROM text_visits
        GROUP BY x
        ORDER BY x
      SQL

      register_cte! :annotation_counts, <<~SQL
        SELECT
          format,
          private,
          COUNT(*) AS count
        FROM annotations
        JOIN text_sections
          ON annotations.text_section_id = text_sections.id
        JOIN texts
          ON text_sections.text_id = texts.id
        WHERE annotations.created_at BETWEEN #{START_DATE_PLACEHOLDER} AND #{END_DATE_PLACEHOLDER}
          AND texts.id = #{SUBJECT_PLACEHOLDER}
        GROUP BY annotations.format, annotations.private
      SQL

      register_cte! :text_section_views, <<~SQL
        SELECT
          text_sections.id,
          text_sections.name,
          COUNT(*) AS count
        FROM analytics_visits
        JOIN analytics_events text_events
          ON analytics_visits.id = text_events.visit_id
        JOIN texts
          ON text_events.properties ->> 'text' = #{SUBJECT_PLACEHOLDER}
        JOIN text_sections
          ON texts.id = text_sections.text_id
        JOIN analytics_events text_section_events
          ON (text_section_events.properties ->> 'text_section')::uuid = text_sections.id
        WHERE text_section_events.time::date BETWEEN #{START_DATE_PLACEHOLDER} AND #{END_DATE_PLACEHOLDER}
          AND text_section_events.name = 'view text_section'
        GROUP BY text_sections.id, text_sections.name
        ORDER BY count
      SQL

      register_cte! :share_clicks, <<~SQL
        SELECT
          COUNT(*) AS count,
          analytics_events.properties ->> 'share_action' AS action
        FROM analytics_events
        JOIN text_sections
          ON (analytics_events.properties ->> 'text_section')::uuid = text_sections.id
        JOIN texts
          ON text_sections.text_id = texts.id
        WHERE analytics_events.name = 'share button click' AND texts.id = #{SUBJECT_PLACEHOLDER}
        GROUP BY action
      SQL

      # END CTES

      # START ANALYTICS

      define_analytic :daily_visitors do
        require_cte! :daily_text_visitors

        build_agg_query(
          name: "daily_visitors",
          type: "xy",
          x_type: "date",
          y_type: "int",
          query_or_table_name: "daily_text_visitors",
          from: "daily_text_visitors"
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

      define_analytic :share_clicks do
        require_cte! :share_clicks

        build_agg_query(
          name: "share_clicks",
          type: "array",
          array_content: "json",
          query_or_table_name: "share_clicks",
          from: "share_clicks"
        )
      end

      # END ANALYTICS

    end
  end
end
