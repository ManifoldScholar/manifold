module Analytics
  module Reports
    class AnalyticsResult < ActiveInteraction::Base

      PARSEABLE_VALUES = %i[meta data]

      attr_reader :id, :data

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
        data.map do |h|
          h.each do |key, value|
            next unless key.to_sym.in?(PARSEABLE_VALUES) && value.present?

            h[key] = JSON.parse(value)
          end
        end.compact
      end

      def input_hash
        Digest::SHA2.hexdigest inputs.except(:data).reduce("") { |m, i| m += i.to_s}
      end

    end
  end
end
