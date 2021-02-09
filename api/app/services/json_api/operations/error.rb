module JSONAPI
  module Operations
    class Error
      extend Dry::Initializer
      extend Memoist

      include Dry::Effects.Reader(:operation_index)
      include Dry::Effects.Reader(:operation_data_index)
      include Dry::Effects.Reader(:operation_data_path)
      include Dry::Monads[:result, :validated]

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
      option :pointer, Types::String.optional, as: :provided_pointer, optional: true, reader: :private

      attr_reader :pointer

      def initialize(*)
        super

        @pointer = calculate_pointer
      end

      memoize def operation_pointer
        index = operation_index { nil }

        return nil if index.blank?

        "/atomic:operations/#{index}"
      end

      memoize def data_pointer
        index = operation_data_index { nil }

        path = operation_data_path { nil }

        return nil if index.blank?

        ["/data", index, path].select(&:present?).join("/")
      end

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

      private

      def calculate_pointer
        parts = [operation_pointer, data_pointer, provided_pointer].select(&:present?)

        File.join(*parts)
      end

      class << self
        # @return [<JSONAPI::Operations::Error>]
        def unroll(err, **options)
          unroller = UnrollErrors.new(options)

          unroller.call(err)
        end
      end
    end
  end
end
