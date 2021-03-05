module Analytics
  module Reports
    class Global < Analytics::Reports::Builder

      TOP_PROJECTS_LIMIT = 5
      SEARCH_TERM_LIMIT = 5

      # BEGIN CTEs

      register_base_cte! :visits, <<~SQL
        SELECT
          id,
          visit_token,
          visitor_token,
          (started_at #{TZ_PLACEHOLDER})::date AS started_on,
          (ended_at #{TZ_PLACEHOLDER})::date AS ended_on,
          (started_at #{TZ_PLACEHOLDER}) AS started_at,
          (ended_at #{TZ_PLACEHOLDER}) AS ended_at
        FROM analytics_visits
        WHERE #{VISIT_DATE_PLACEHOLDER}
        ORDER BY started_at
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

      register_cte! :top_projects, <<~SQL
        SELECT
          projects.id AS project_id,
          projects.title AS project_title,
          COUNT(*) AS view_count
        FROM visits
        JOIN analytics_events ON visits.id = analytics_events.visit_id
        JOIN projects ON projects.id = (analytics_events.properties ->> '#{Project.model_name.param_key}')::uuid
        WHERE analytics_events.name = '#{Analytics::Event.event_name_for(:view, Project)}'
        GROUP BY project_id, project_title
        ORDER BY view_count DESC
        LIMIT #{TOP_PROJECTS_LIMIT}
      SQL

      register_cte! :active_visitors, <<~SQL
        SELECT DISTINCT
          visit_token
        FROM visits
        JOIN analytics_events
          ON visits.id = analytics_events.visit_id
        WHERE analytics_events.name LIKE 'create%'
        GROUP BY visit_token
      SQL

      register_cte! :favorites, <<~SQL
        SELECT
          user_id,
          COUNT(*)
        FROM favorites
        WHERE favoritable_type = 'Project'
        GROUP BY user_id
      SQL

      register_cte! :search_terms, <<~SQL
        SELECT
          events.properties ->> 'keyword' AS keyword,
          COUNT(*) AS count
        FROM visits
        JOIN analytics_events events
          ON visits.id = events.visit_id
        WHERE name = 'search'
        GROUP BY keyword
        ORDER BY count DESC
        LIMIT #{SEARCH_TERM_LIMIT}
      SQL

      # END CTES

      # BEGIN ANALYTICS

      # daily_visitors
      # X/Y of unique visitors per day
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

      # returning_visitors
      # % of unique visitors that have more than one visit in date range
      define_analytic :returning_visitors do
        require_cte! :unique_visitors

        build_percent_query(
          name: "returning_visitors",
          numerator: "(SELECT COUNT(*) FROM unique_visitors WHERE visit_count > 1)",
          denominator: "COUNT(*)",
          from: "unique_visitors"
        )
      end

      # average_visit_duration
      # Average of difference between visit start and end times
      define_analytic :average_visit_duration do
        build_simple_query(
          name: "average_visit_duration",
          type: "float",
          value: "COALESCE(EXTRACT(EPOCH FROM AVG(ended_at - started_at)), 0)",
          filter: "ended_at IS NOT NULL"
        )
      end

      # top_projects
      # Array of project names, ranked by view counts desc
      define_analytic :top_projects do
        require_cte! :top_projects

        <<~SQL
          SELECT
            'top_projects' AS name,
            #{build_meta('array')},
            #{build_row_data('top_projects')}
          FROM top_projects
        SQL
      end

      # active_users
      # % of logged-in users with a visit in this time period
      define_analytic :active_visitors do
        require_cte! :unique_visitors
        require_cte! :active_visitors

        build_percent_query(
          name: "active_visitors",
          numerator: "COUNT(*)",
          denominator: "(SELECT COUNT(*) FROM unique_visitors)",
          from: "active_visitors"
        )
      end

      # favorited_projects
      # Average number of projects favorited by users
      define_analytic :favorited_projects do
        require_cte! :favorites

        build_simple_query(
          name: "favorited_projects",
          type: "float",
          value: "AVG(count)",
          from: "favorites"
        )
      end

      # top_search_terms
      # Array of search terms, ranked by count desc
      define_analytic :top_search_terms do
        require_cte! :search_terms

        build_agg_query(
          name: "top_search_terms",
          type: "array",
          array_content: "json",
          query_or_table_name: "search_terms",
          from: "search_terms"
        )
      end

      # END ANALYTICS

    end
  end
end
