module Analytics
  module Reports
    class ForProject < Analytics::Reports::Builder

      record :scope, class: Project

      # BEGIN CTES

      register_base_cte! :visits, <<~SQL
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
          AND analytics_events.name = 'view project'
          AND analytics_events.properties ->> 'project' = #{SCOPE_PLACEHOLDER}
        ORDER BY analytics_visits.started_at
      SQL

      register_cte! :daily_project_visitors, <<~SQL
        SELECT
          time::date AS x,
          COUNT(DISTINCT visitor_token) AS y
        FROM visits
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
        JOIN projects
          ON texts.project_id = projects.id
        WHERE annotations.created_at BETWEEN #{START_DATE_PLACEHOLDER} AND #{END_DATE_PLACEHOLDER}
          AND projects.id = #{SCOPE_PLACEHOLDER}
        GROUP BY annotations.format, annotations.private
      SQL

      register_cte! :favorites, <<~SQL
        SELECT
          COUNT(*) AS total_favorites,
          (SELECT COUNT(*) FROM favorites WHERE created_at BETWEEN #{START_DATE_PLACEHOLDER} AND #{END_DATE_PLACEHOLDER}) AS favorites_this_period
        FROM favorites
        WHERE favoritable_type = 'Project' AND favoritable_id = #{SCOPE_PLACEHOLDER}
      SQL

      # END CTES

      # BEGIN ANALYTICS

      define_analytic :daily_visitors do
        require_cte! :daily_project_visitors

        build_agg_query(
          name: 'daily_visitors',
          type: 'xy',
          x_type: 'date',
          y_type: 'int',
          query_or_table_name: "daily_project_visitors",
          from: "daily_project_visitors"
        )
      end

      define_analytic :annotations do
        require_cte! :annotation_counts

        build_agg_query(
          name: "annotations",
          type: "json",
          value_type: "int",
          query_or_table_name: "annotation_counts",
          from: "annotation_counts"
        )
      end

      define_analytic :favorites_this_period do
        require_cte! :favorites

        build_simple_query(
          name: "favorites_this_period",
          type: "int",
          value: "favorites_this_period",
          from: "favorites"
        )
      end

      define_analytic :total_favorites do
        require_cte! :favorites

        build_simple_query(
          name: "total_favorites",
          type: "int",
          value: "total_favorites",
          from: "favorites"
        )
      end

      # END ANALYTICS

    end
  end
end
