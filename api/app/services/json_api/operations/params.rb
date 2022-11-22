module JSONAPI
  module Operations
    class Params < Types::FlexibleStruct
      transform_keys do |key|
        case key
        when /\Aatomic:operations\z/ then :operations
        else
          key.to_sym
        end
      end

      attribute :operations, Types::Array do
        attribute :op, Types::String.enum("add", "update", "remove")

        attribute? :href, Types::String

        attribute? :ref do
          include Dry::Effects.Resolve(:current_user)

          attribute :type, Types::String
          attribute? :id, Types::String
          attribute? :lid, Types::String
          attribute? :relationship, Types::String

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
              current_user { AnonymousUser.new }.id
            else
              id
            end
          end

          def to_collection_params
            {
              collector_id: collector_id,
              collector_type: type
            }
          end
        end

        attribute? :data, Types::Array.of(Types::Hash)

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

        def to_collection_params
          return {} unless for_collection?

          ref.to_collection_params.merge(
            collectables: data
          )
        end
      end

      class << self
        # @param [ActionController::Params] params
        def parse(params)
          raw = params.respond_to?(:to_unsafe_h) ? params.to_unsafe_h : Hash(params)

          new raw
        end
      end
    end
  end
end
