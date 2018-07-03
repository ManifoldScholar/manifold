module Ingestions
  module Concerns
    module CatchesExceptions
      extend ActiveSupport::Concern

      included do
        set_callback :execute, :around, :watch_for_uncaught_exceptions!
      end

      # @!attribute [r] uncaught_exception
      # @return [Exception, nil]
      attr_reader :uncaught_exception

      # @abstract
      # @param [Exception] exception
      # @return [void]
      def handle_uncaught_exception!(exception); end

      # @api private
      # @return [void]
      def watch_for_uncaught_exceptions!
        yield if block_given?
      rescue StandardError => e
        @uncaught_exception = e
        error = e.message
        if Rails.env.development?
          Rails.backtrace_cleaner.clean(e.backtrace).each do |line|
            error += "\n#{line}"
          end
        end
        errors.add :base, error
      end
    end
  end
end
