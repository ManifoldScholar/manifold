module Analytics
  module Reports
    class ScopedBuilder < Analytics::Reports::Builder

      RESOURCE_PLACEHOLDER = "{{ SCOPE ID }}".freeze

      string :record_id, default: nil
      string :record_type, default: nil

      object :resource, class: ApplicationRecord, default: nil

      protected

      def set_valid_resource
        return resource if resource.present?

        resource_class = record_type.classify.safe_constantize
        resource_class&.find(record_id)
      end

      def valid_resource
        @valid_resource ||= set_valid_resource
      end

      def authorize
        AnalyticReportAuthorizer.readable_by? user, report_scope: valid_resource
      end

      def sub_placeholders(sql)
        sql = super(sql)
        sql.gsub(RESOURCE_PLACEHOLDER, quote(respond_to?(:resource) ? valid_resource.id : nil))
      end

    end
  end
end
