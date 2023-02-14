module Analytics
  module Reports
    class PaginatedBuilder < Analytics::Reports::Builder

      PAGINATION_PLACEHOLDER = "{{ PAGINATION }}".freeze

      integer :page, default: 1
      integer :per_page, default: 20

      def pagination_dict
        total_count = count_cte(cte_for_count)
        total_pages = (total_count / per_page.to_f).ceil

        {
          per_page: per_page.to_i,
          current_page: page.to_i,
          next_page: page.to_i < total_pages ? page.to_i + 1 : nil,
          prev_page: page.to_i > 1 ? page.to_i - 1 : nil,
          total_pages: total_pages,
          total_count: total_count
        }
      end

      protected

      def sub_placeholders(sql, with_pagination: true)
        sql = super(sql)
        pagination_replace = with_pagination ? "LIMIT #{per_page} OFFSET #{(page - 1) * per_page}" : ""
        sql.gsub(PAGINATION_PLACEHOLDER, pagination_replace)
      end

      def count_cte(cte)
        with = self.class.ctes[cte]
        sql = sub_placeholders("WITH #{with} SELECT COUNT(*) AS count FROM #{cte}", with_pagination: false)
        result = ApplicationRecord.connection.select_all(sql).to_a
        result.first["count"]
      end

      def cte_for_count
        self.class.base_ctes.first
      end

    end
  end
end
