module Analytics
  module Reports
    class Builder < ActiveInteraction::Base

      TIME_ZONE = "PST".freeze
      VISIT_DATE_PLACEHOLDER = "{{ VISIT DATE FILTER }}".freeze
      START_DATE_PLACEHOLDER = "{{ START DATE }}".freeze
      END_DATE_PLACEHOLDER = "{{ END DATE }}".freeze
      TZ_PLACEHOLDER = "{{ TIME ZONE }}".freeze
      GENERATE_SERIES_PLACEHOLDER = "{{ GENERATE_SERIES }}".freeze

      attr_reader :cached_result

      array :analytics, default: -> { self.class.analytics } do
        symbol
      end

      date :start_date, default: nil
      date :end_date, default: nil

      boolean :force_cache_refresh, default: false
      boolean :allow_cached_result, default: true

      def execute
        return cached_analytics if use_cached_analytics?

        require_base_ctes

        Analytics::Reports::AnalyticsResult.run data: analytics_data, **inputs, start_date: valid_start_date, end_date: valid_end_date
      end

      def pagination_dict
        {
          per_page: 1,
          current_page: 1,
          next_page: nil,
          prev_page: nil,
          total_pages: 1,
          total_count: 1
        }
      end

      # protected

      ## Class Methods

      class << self

        attr_reader :ctes, :base_ctes, :analytics

        def register_base_cte!(name, sql)
          register_cte!(name, sql)
          @base_ctes ||= []
          @base_ctes.push(name)
        end

        def register_cte!(name, sql)
          sql = <<~SQL
            #{name} AS (
              #{sql}
            )
          SQL

          @ctes ||= {}.with_indifferent_access
          @ctes[name] = sql
        end

        def available_ctes
          ctes.symbolize_keys.keys
        end

        def define_analytic(name, &block)
          @analytics = [] unless @analytics.present?

          @analytics.push(name)

          define_method name, &block
        end

        def quote(str)
          ApplicationRecord.connection.quote(str)
        end

        def timestamp_field_in_range(field_name)
          "(#{field_name} #{TZ_PLACEHOLDER})::date BETWEEN #{START_DATE_PLACEHOLDER} AND #{END_DATE_PLACEHOLDER}"
        end

      end

      ## Instance methods

      def require_base_ctes
        self.class.base_ctes.each { |cte| require_cte!(cte) }
      end

      def analytics_data
        @analytics_data ||= ApplicationRecord.connection.select_all(full_query).to_a
      end

      def full_query
        subqueries = analytics.map do |f|
          send(f) if respond_to?(f)
        end

        raw_query = with_required_ctes do
          subqueries.join("UNION ALL\n")
        end

        sub_placeholders(raw_query)
      end

      def use_cached_analytics?
        allow_cached_result && start_date.nil? && end_date.nil?
      end

      def valid_start_date
        @valid_start_date ||= start_date || (Date.current - 31.days)
      end

      def valid_end_date
        @valid_end_date ||= end_date || (Date.current - 1.day)
      end

      def cached_analytics
        @cached_result = true

        # rubocop:disable Layout/LineLength
        compose Analytics::Reports::AnalyticsResult, data: cached_analytics_result, **inputs, start_date: valid_start_date, end_date: valid_end_date
        # rubocop:enable Layout/LineLength
      end

      def cached_analytics_result
        Rails.cache.fetch(cache_key,
                          force: force_cache_refresh,
                          skip_nil: true,
                          expires_in: (Time.current.end_of_day - Time.current).seconds,
                          race_condition_ttl: 10.seconds) do
          compose(self.class, **inputs, start_date: valid_start_date, end_date: valid_end_date).data
        end
      end

      def cache_key
        @cache_key ||= "analytics/#{self.class.name.demodulize}/#{@resource&.id || 'all'}"
      end

      # Placeholders

      def sub_placeholders(sql, zone = valid_start_date.to_time.zone)
        sql.gsub(VISIT_DATE_PLACEHOLDER, visit_date_sql(zone))
          .gsub(START_DATE_PLACEHOLDER, start_date_sql)
          .gsub(END_DATE_PLACEHOLDER, end_date_sql)
          .gsub(TZ_PLACEHOLDER, timezone_sql)
          .gsub(GENERATE_SERIES_PLACEHOLDER, generate_series_sql)
      end

      def timezone_sql(zone = valid_start_date.in_time_zone.zone)
        "AT TIME ZONE 'UTC' AT TIME ZONE #{quote(zone)}"
      end

      def start_date_sql(_zone = valid_start_date.to_time.zone)
        "#{quote(valid_start_date)}::date"
      end

      def end_date_sql(_zone = valid_end_date.to_time.zone)
        "#{quote(valid_end_date)}::date"
      end

      def visit_date_sql(_zone = valid_start_date.to_time.zone)
        self.class.timestamp_field_in_range("started_at")
      end

      def generate_series_sql(zone = valid_start_date.to_time.zone)
        <<~SQL.strip_heredoc.squish
        generate_series(
          (TIMESTAMP #{quote(valid_start_date)} AT TIME ZONE #{quote(zone)}),
          (TIMESTAMP #{quote(valid_end_date)} AT TIME ZONE #{quote(zone)}),
          INTERVAL '1 day'
        ) AS t(d)
        SQL
      end

      def require_cte!(cte_name)
        return unless self.class.available_ctes.include? cte_name

        @required_ctes ||= []
        @required_ctes.push(cte_name)
      end

      def required_ctes
        @required_ctes.uniq
      end

      def with_required_ctes
        cte_sql = "WITH #{required_ctes.map { |c| self.class.ctes[c] }.join(',')}"

        <<~SQL
          #{required_ctes.present? ? cte_sql : nil}
          #{yield}
        SQL
      end

      # Query generators

      def quote(value)
        ApplicationRecord.connection.quote(value)
      end

      def build_simple_query(name:, type:, value:, value_key: "value", from: self.class.base_ctes.first, filter: nil, **metadata) # rubocop:disable Metrics/ParameterLists
        <<~SQL
          SELECT
            '#{name}' AS name,
            #{build_meta(type, **metadata)},
            #{build_simple_data(value, value_key: value_key)}
          FROM #{from}
          #{filter.present? ? "WHERE #{filter}" : nil}
        SQL
      end

      def build_agg_query(name:, type:, query_or_table_name:, from: self.class.base_ctes.first, filter: nil, **metadata) # rubocop:disable Metrics/ParameterLists
        <<~SQL
          SELECT
            '#{name}' AS name,
            #{build_meta(type, **metadata)},
            #{build_row_data(query_or_table_name)}
          FROM #{from}
          #{filter.present? ? "WHERE #{filter}" : nil}
        SQL
      end

      def build_percent_query(name:, numerator:, denominator:, **metadata)
        build_simple_query(name: name, type: "percent", value: build_percent_data(numerator, denominator), value_key: nil, **metadata)
      end

      def build_json(name, quote: true, **args)
        args.transform_keys! { |k| quote(k) } unless quote
        args = args.to_a.flatten
        args.map! { |a| quote(a.to_s) } if quote

        "JSON_BUILD_OBJECT(#{args.join(',')}) AS #{name}"
      end

      def build_json_array(name, query_or_table_name)
        "COALESCE(ARRAY_TO_JSON(ARRAY_AGG(ROW_TO_JSON(#{query_or_table_name}))), '[]') AS #{name}"
      end

      def build_meta(type, **metadata)
        build_json("meta", { type: type }.merge(metadata))
      end

      def build_simple_data(value, is_query: true, value_key: "value")
        value_hash = if value_key.present?
                       { value_key.to_sym => value }
                     else
                       value.is_a?(Hash) ? value : {}
                     end
        build_json("data", quote: !is_query, **value_hash)
      end

      def build_row_data(query_or_table_name)
        build_json_array("data", query_or_table_name)
      end

      def build_percent_data(numerator, denominator)
        fraction = "COALESCE(#{numerator}::float / NULLIF(#{denominator}, 0), 0)"
        { numerator: "COALESCE(#{numerator}, 0)", denominator: "COALESCE(#{denominator}, 0)", fraction: fraction }
      end

    end
  end
end
