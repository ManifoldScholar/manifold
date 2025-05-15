# frozen_string_literal: true

module JSONAPI
  module Operations
    class Operation < JSONAPI::Operations::BaseStruct
      attribute :op, ::JSONAPI::Types::OperationOp

      attribute? :href, ::JSONAPI::Types::String

      attribute? :ref do
        include Dry::Effects.Reader(:current_user)

        attribute :type, ::JSONAPI::Types::String
        attribute? :id, ::JSONAPI::Types::String
        attribute? :lid, ::JSONAPI::Types::String
        attribute? :relationship, ::JSONAPI::Types::String

        def for_collection?
          relationship == "collection"
        end

        def for_current_user?
          for_user? && lid == "me"
        end

        def for_user?
          type.match?(/\Ausers?/i)
        end

        def collector_id
          if for_current_user?
            current_user.id
          else
            id
          end
        end

        def to_collection_params
          {
            collector_id: collector_id,
            collector_type: type,
            user: current_user,
          }
        end
      end

      attribute? :data, ::JSONAPI::Types::Array.of(::JSONAPI::Types::Hash)

      def for_collection?
        has_ref? && ref.for_collection?
      end

      def has_ref?
        ref.present?
      end

      def add?
        op == "add"
      end

      def remove?
        op == "remove"
      end

      def update?
        op == "update"
      end

      def add_or_update?
        add? || update?
      end

      # @return [Class, nil]
      def operator_klass
        if for_collection? && add_or_update?
          ::Collections::Operations::ValidateAndAssignMultiple
        elsif for_collection? && remove?
          ::Collections::Operations::ValidateAndRemoveMultiple
        end
      end

      # @return [Hash, nil]
      def operator_params
        return unless for_collection?

        to_collection_params
      end

      def to_collection_params
        # :nocov:
        return {} unless for_collection?
        # :nocov:

        ref.to_collection_params.merge(
          collectables: data
        )
      end
    end
  end
end
