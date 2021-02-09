module Legacy
  class AddFavorite
    def call(user:, params:)
      params = params.to_unsafe_h if params.respond_to?(:to_unsafe_h)

      Operation.new(user: user, params: params).call
    end

    class Operation
      extend Dry::Initializer

      include Dry::Monads[:do, :result]

      option :params do
        option :data do
          option :relationships do
            option :favoritable do
              option :data do
                include Sliceable

                option :id, as: :collectable_id
                option :type, as: :collectable_type

                def to_nested_operation_options
                  slice(:collectable_id, :collectable_type)
                end
              end
            end
          end
        end
      end

      option :user, model: "User"

      delegate :data, to: "params.data.relationships.favoritable", prefix: :favoritable

      def call
        options = to_nested_operation_options

        Collections::Operations::ValidateAndAssign.new(options).call
      end

      private

      def to_nested_operation_options
        favoritable_data.to_nested_operation_options.merge(
          user: user,
          collector_id: user.id,
          collector_type: "user"
        )
      end
    end
  end
end
