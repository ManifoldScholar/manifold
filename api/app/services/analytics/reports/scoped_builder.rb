module Analytics
  module Reports
    class ScopedBuilder < Analytics::Reports::Builder

      RESOURCE_PLACEHOLDER = "{{ SCOPE ID }}".freeze

      string :record_id, default: nil
      string :record_type, default: nil

      object :resource, class: ApplicationRecord

      set_callback :type_check, :before, :get_resource

      protected

      def get_resource
        return if resource.present?

        resource_class = record_type.classify.safe_constantize
        @resource = resource_class&.find(record_id)
      end

      def authorize
        AnalyticReportAuthorizer.readable_by? user, report_scope: resource
      end

      def sub_placeholders(sql)
        sql = super(sql)
        sql.gsub(RESOURCE_PLACEHOLDER, quote(respond_to?(:resource) ? resource.id : nil))
      end

    end
  end
end
