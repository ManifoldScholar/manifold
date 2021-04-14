module Analytics
  module Reports
    class TopSearches < Analytics::Reports::PaginatedBuilder

      register_base_cte! :searches, <<~SQL
        SELECT
          analytics_events.properties ->> 'keyword' AS keyword,
          COUNT(*) AS count
        FROM analytics_events
        JOIN analytics_visits
          ON analytics_events.visit_id = analytics_visits.id
        WHERE #{VISIT_DATE_PLACEHOLDER}
          AND analytics_events.name = '#{Analytics::Event::SEARCH_EVENT_NAME}'
        GROUP BY keyword
        ORDER BY count DESC
        #{PAGINATION_PLACEHOLDER}
      SQL

      define_analytic :searches do
        build_agg_query(
          name: "searches",
          type: "array",
          array_content: "json",
          query_or_table_name: "searches",
          from: "searches"
        )
      end
    end
  end
end
