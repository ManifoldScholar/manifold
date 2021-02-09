module JSONAPI
  module Helpers
    class Error
      extend Dry::Initializer
      extend Memoist

      include Dry::Monads[:result]

      include Sliceable

      STATUS = proc do |value|
        case value
        when Symbol
          Rack::Utils.status_code(value).nonzero? || 400
        when 400...600
          value
        when String
          STATUS[value.to_i]
        else
          "400"
        end.to_s
      end

      DEFAULT_STATUS = proc do
        case code
        when /not_found/ then :not_found
        when /invalid_model/ then :unprocessable_entity
        when /forbidden/ then :forbidden
        else
          :bad_request
        end
      end

      option :id, Types::Coercible::String.optional, optional: true
      option :title, Types::Coercible::String.optional, optional: true
      option :detail, Types::Coercible::String.optional, optional: true
      option :code, Types::Coercible::String.optional, optional: true
      option :status, STATUS, default: DEFAULT_STATUS
      option :meta, Types::Hash, optional: true
      option :pointer, Types::String.optional, optional: true, reader: :private

      def source
        return nil unless pointer.present?

        { pointer: pointer }.compact
      end

      def as_json(*)
        slice(:source).merge(self.class.dry_initializer.public_attributes(self)).compact
      end

      def to_result
        Failure[self]
      end

      alias to_monad to_result

      class << self
        # @return [<JSONAPI::Helpers::Error>]
        def unroll(err, **options)
          unroller = JSONAPI::Helpers::UnrollErrors.new(options)

          unroller.call(err)
        end
      end
    end
  end
end
