module Analytics
  module Reports
    class ForProject < Analytics::Reports::ScopedBuilder

      validate :resource_is_project!

      def resource_is_project!
        errors.add :resource, "must be a project" unless valid_resource.is_a?(Project)
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
          AND analytics_events.name = '#{Analytics::Event.event_name_for(:view, Project)}'
          AND analytics_events.properties ->> '#{Project.model_name.param_key}' = #{RESOURCE_PLACEHOLDER}
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

      register_cte! :unique_visitors, <<~SQL
        SELECT
          visitor_token,
          COUNT(*) AS visit_count
        FROM visits
        GROUP BY visitor_token
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
        JOIN projects
          ON texts.project_id = projects.id
        WHERE #{timestamp_field_in_range('annotations.created_at')}
          AND projects.id = #{RESOURCE_PLACEHOLDER}
      SQL

      register_cte! :favorites, <<~SQL
        SELECT
          COUNT(*) AS total_favorites,
          COUNT(*) FILTER (WHERE favoritable_type = 'Project' AND favoritable_id = #{RESOURCE_PLACEHOLDER} AND #{timestamp_field_in_range('created_at')}) AS favorites_this_period
        FROM favorites
        WHERE favoritable_type = 'Project' AND favoritable_id = #{RESOURCE_PLACEHOLDER}
      SQL

      # END CTES

      # BEGIN ANALYTICS

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

      define_analytic :unique_visitors do
        require_cte! :unique_visitors

        build_simple_query(
          name: "unique_visitors",
          type: "integer",
          value: "COUNT(*)",
          from: "unique_visitors"
        )
      end

      define_analytic :annotations do
        require_cte! :annotation_counts

        build_agg_query(
          name: "annotations",
          type: "array",
          array_content: "json",
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
