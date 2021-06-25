require "securerandom"

module V1
  module Helpers
    class Error
      attr_reader :id, :title, :detail, :source

      def initialize(id:, title:, detail:, source:)
        @id = id
        @title = title
        @detail = detail
        @source = source
      end
    end

    class Errors

      def initialize(errors)
        @time = Time.now
        @random = SecureRandom.hex(6)
        @errors = errors
      end

      # rubocop:disable Metrics/MethodLength
      def for_serialization
        collected_errors = []
        titles = []

        @errors.details.each do |attribute, errors|
          errors.each do |error_details|
            type = error_details[:error]
            options = error_details.except(:error)
            title = "#{attribute}_#{type}"
            next if titles.include? title

            titles << title
            collected_errors << Error.new(
              id: id(title),
              title: title,
              detail: detail(attribute, type, options),
              source: { pointer: pointer(attribute) }
            )
          end
        end
        collected_errors
      end
      # rubocop:enable Metrics/MethodLength

      private

      def id(title)
        "#{@random}_#{title}"
      end

      def detail(attribute, type, options = {})
        base = type if type.is_a? String
        base = @errors.generate_message(attribute, type, options) if type.is_a? Symbol
        # NOTE: Potential option for conversion to dry types
        msg = base.is_a?(Hash) ? base.values.first : base
        return msg[1..] if msg.start_with?("^")

        "#{attribute.to_s.humanize} #{msg}"
      end

      def pointer(attribute)
        format("/data/attributes/%<attribute>s", attribute: attribute.to_s.camelize(:lower))
      end

    end
  end
end
