module JSONAPI
  module Helpers
    # rubocop:disable Metrics/CyclomaticComplexity
    class UnrollErrors
      extend Dry::Initializer

      VALIDATED_LIST = ->(o) { o.is_a?(Dry::Monads::List) && o.type == Dry::Monads::Validated }

      TUPLE = Dux.yard("(Symbol, String)")

      # @return [<JSONAPI::Helpers::Error>]
      def call(err)
        @errors = []

        unroll err

        add_error! code: :unknown, title: "Something went wrong" if @errors.none?

        @errors
      end

      private

      # @return [void]
      def add_error!(**attributes)
        error = JSONAPI::Helpers::Error.new(**attributes)

        @errors << error
      end

      # @return [void]
      def unroll(err)
        case err
        when VALIDATED_LIST, Dry::Monads::List
          unroll err.to_a
        when TUPLE
          code, title = err

          add_error! code: code, title: title
        when Symbol
          add_error! code: err
        when String
          add_error! title: err
        when Array
          err.each { |element| unroll element }
        when JSONAPI::Operations::Error, JSONAPI::Helpers::Error
          @errors << err
        end
      end
    end
    # rubocop:enable Metrics/CyclomaticComplexity
  end
end
