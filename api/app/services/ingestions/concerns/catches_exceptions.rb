# frozen_string_literal: true

module Ingestions
  module Concerns
    module CatchesExceptions
      extend ActiveSupport::Concern

      included do
        isolatable!
        haltable!
        set_callback :execute, :around, :watch_for_uncaught_exceptions!
      end

      # @!attribute [r] uncaught_exception
      # @return [Exception, nil]
      attr_reader :uncaught_exception

      # @api private
      # @return [void]
      def watch_for_uncaught_exceptions!
        yield if block_given?
      rescue ::Ingestions::IngestionError => e
        @uncaught_exception = e
        error = e.message
        error += "\n\n#{e.cause.message}" if e.cause.present?
        if Rails.env.development?
          Rails.backtrace_cleaner.clean(e.backtrace).each do |line|
            error += "\n#{line}"
          end
        end
        halt!(error)
      end
    end
  end
end
