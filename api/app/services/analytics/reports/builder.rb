module Analytics
  module Reports
    class Builder < ActiveInteraction::Base

      TIME_ZONE = "PST".freeze
      VISIT_DATE_PLACEHOLDER = "{{ VISIT DATE FILTER }}".freeze
      START_DATE_PLACEHOLDER = "{{ START DATE }}".freeze
      END_DATE_PLACEHOLDER = "{{ END DATE }}".freeze
      TZ_PLACEHOLDER = "{{ TIME ZONE }}".freeze
      SCOPE_PLACEHOLDER = "{{ SCOPE ID }}".freeze

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

        set_default_dates
        require_base_ctes

        Analytics::Reports::AnalyticsResult.run data: fetch_analytics_data, **inputs
      end

      # protected

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
          @analytics ||= []
          @analytics.push(name)

          define_method name, &block
        end

        def quote(str)
          ApplicationRecord.connection.quote(str)
        end

      end

      def require_base_ctes
        self.class.base_ctes.each { |cte| require_cte!(cte) }
      end

      def fetch_analytics_data
        ApplicationRecord.connection.select_all(full_query).to_a
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

      def set_default_dates
        # rubocop:disable Naming/MemoizedInstanceVariableName
        @start_date ||= (Date.current - 8.days)
        @end_date ||= (Date.current - 1.day)
        # rubocop:enable Naming/MemoizedInstanceVariableName
      end

      def cached_analytics
        set_default_dates
        cache_key = "analytics/#{self.class.name.demodulize}/#{@scope&.id || 'all'}"
        @cached_result = true

        result = Rails.cache.fetch(cache_key,
                          force: force_cache_refresh,
                          skip_nil: true,
                          expires_in: (Time.now.end_of_day - Time.now).seconds,
                          race_condition_ttl: 10.seconds) do
          compose(self.class, scope: @scope, start_date: @start_date, end_date: @end_date).result
        end

        compose Analytics::Reports::AnalyticsResult, data: result, **inputs
      end

      # Placeholders

      def sub_placeholders(sql)
        zone = start_date.to_time.zone

        sql.gsub(VISIT_DATE_PLACEHOLDER, visit_date_sql(zone))
          .gsub(START_DATE_PLACEHOLDER, start_date_sql)
          .gsub(END_DATE_PLACEHOLDER, end_date_sql)
          .gsub(TZ_PLACEHOLDER, quote(zone))
          .gsub(SCOPE_PLACEHOLDER, quote(respond_to?(:scope) ? scope&.id : nil))
      end

      def start_date_sql(zone = start_date.to_time.zone)
        "(TIMESTAMP #{quote(start_date)} AT TIME ZONE #{quote(zone)})::date"
      end

      def end_date_sql(zone = end_date.to_time.zone)
        "(TIMESTAMP #{quote(end_date)} AT TIME ZONE #{quote(zone)})::date"
      end

      def visit_date_sql(zone = start_date.to_time.zone)
        %(started_at::date >= (TIMESTAMP #{quote(start_date)} AT TIME ZONE '#{zone}')::date
          AND (started_at::date <= (TIMESTAMP #{quote(end_date)} AT TIME ZONE '#{zone}')::date))
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

      def build_simple_query(name:, type:, value:, from: self.class.base_ctes.first, filter: nil, **metadata) # rubocop:disable Metrics/ParameterLists
        <<~SQL
          SELECT
            '#{name}' AS name,
            #{build_meta(type, **metadata)},
            #{build_simple_data(value)}
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

      def build_json(name, quote: true, **args)
        args.transform_keys! { |k| quote(k) } unless quote
        args = args.to_a.flatten
        args.map! { |a| quote(a.to_s) } if quote

        "JSON_BUILD_OBJECT(#{args.join(',')}) AS #{name}"
      end

      def build_json_array(name, query_or_table_name)
        "ARRAY_TO_JSON(ARRAY_AGG(ROW_TO_JSON(#{query_or_table_name}))) AS #{name}"
      end

      def build_meta(type, **metadata)
        build_json("meta", { type: type }.merge(metadata))
      end

      def build_simple_data(value, is_query: true)
        build_json("data", quote: !is_query, value: value)
      end

      def build_row_data(query_or_table_name)
        build_json_array("data", query_or_table_name)
      end

    end
  end
end
