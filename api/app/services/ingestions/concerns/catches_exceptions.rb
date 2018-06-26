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

        errors.add :base, "Uncaught exception: #{e.message}"
      end
    end
  end
end
