module Analytics
  module Reports
    class Global < Analytics::Reports::Builder

      TOP_PROJECTS_LIMIT = 10
      SEARCH_TERM_LIMIT = 10

      # BEGIN CTES

      register_base_cte! :visits, <<~SQL
        SELECT
          id,
          visit_token,
          visitor_token,
          started_at,
          ended_at
        FROM analytics_visits
        WHERE #{VISIT_DATE_PLACEHOLDER}
        ORDER BY started_at
      SQL

      register_cte! :daily_visitors, <<~SQL
        SELECT
          started_at::date AS x,
          COUNT(DISTINCT visitor_token) AS y
        FROM visits
        GROUP BY x
        ORDER BY x
      SQL

      register_cte! :unique_visitors, <<~SQL
        SELECT
          visitor_token,
          COUNT(*) AS count
        FROM visits
        GROUP BY visitor_token
      SQL

      register_cte! :top_projects, <<~SQL
        SELECT
          projects.id AS project_id,
          projects.title AS project_title,
          COUNT(*) AS view_count
        FROM analytics_events
        JOIN projects ON projects.id = (analytics_events.properties ->> 'project')::uuid
        WHERE analytics_events.name = '#{Analytics::Event::PROJECT_VIEW_EVENT_NAME}'
        GROUP BY project_id, project_title
        ORDER BY view_count
        LIMIT #{TOP_PROJECTS_LIMIT}
      SQL

      register_cte! :active_users, <<~SQL
        SELECT DISTINCT
          users.id
        FROM users
        LEFT OUTER JOIN annotations ON users.id = annotations.creator_id
        LEFT OUTER JOIN comments ON users.id = comments.creator_id
        WHERE NOT(annotations.id IS NULL AND comments.id IS NULL)
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
          events.properties ->> 'keyword' AS search_term,
          COUNT(*) AS count
        FROM visits
        JOIN analytics_events events
          ON visits.id = events.visit_id
        WHERE name = 'search'
        GROUP BY search_term
        ORDER BY count
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

      # returning_visitors
      # % of unique visitors that have more than one visit in date range
      define_analytic :returning_visitors do
        require_cte! :unique_visitors

        build_simple_query(
          name: "returning_visitors",
          type: "float",
          value: "COALESCE((SELECT COUNT(*) FROM unique_visitors HAVING COUNT(*) > 1) / (NULLIF(COUNT(*)::float, 0)), 0)"
        )
      end

      # average_visit_duration
      # Average of difference between visit start and end times
      define_analytic :average_visit_duration do
        build_simple_query(
          name: "average_visit_duration",
          type: "interval",
          value: "AVG(ended_at - started_at)",
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
      define_analytic :active_users do
        require_cte! :active_users

        build_simple_query(
          name: "active_users",
          type: "float",
          value: "(COUNT(*) / NULLIF((SELECT COUNT(users.id) FROM users)::float, 0))",
          from: "active_users"
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
          query_or_table_name: "search_terms",
          from: "search_terms"
        )
      end

      # END ANALYTICS

    end
  end
end
