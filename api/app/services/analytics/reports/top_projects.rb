module Analytics
  module Reports
    class TopProjects < Analytics::Reports::PaginatedBuilder

      register_base_cte! :project_views, <<~SQL
        SELECT
          projects.id AS project_id,
          projects.title AS project_title,
          COUNT(analytics_events.id) AS view_count
        FROM projects
        LEFT OUTER JOIN analytics_events
          ON projects.id = (analytics_events.properties ->> 'project')::uuid
        LEFT OUTER JOIN analytics_visits
          ON analytics_events.visit_id = analytics_visits.id
        WHERE #{VISIT_DATE_PLACEHOLDER}
        GROUP BY projects.id, projects.title
        ORDER BY COUNT(analytics_events.id) DESC
        #{PAGINATION_PLACEHOLDER}
      SQL

      define_analytic :project_views do
        build_agg_query(
          name: "project_views",
          type: "array",
          array_content: "json",
          query_or_table_name: "project_views",
          from: "project_views"
        )
      end
    end
  end
end
