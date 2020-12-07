module Analytics
  module Reports
    class AnalyticsResult < ActiveInteraction::Base

      PARSEABLE_VALUES = %i[meta data].freeze

      attr_reader(:id, :data, :reports, :start_date, :end_date)

      string :id, default: -> { input_hash }
      date :start_date
      date :end_date
      array :analytics do
        symbol
      end

      array :data do
        hash do
          string :name
          string :meta
          string :data, default: nil
        end
      end

      def execute
        parse_data
      end

      def save!; end

      private

      def parse_data
        @reports = data.map do |h|
          h.each_with_object({}) do |(key, value), hsh|
            hsh[key] = if key.to_sym.in?(PARSEABLE_VALUES) && value.present?
                         JSON.parse(value)
                       else
                         value
                       end
          end
        end.compact
        @reports
      end

      def input_hash
        Digest::SHA2.hexdigest inputs.except(:data).reduce("") { |m, i| m + i.to_s }
      end

    end
  end
end
