module Legacy
  class Unfavorite
    def call(options)
      Operation.new(options).call
    end

    class Operation
      extend Dry::Initializer

      include Dry::Monads[:result]

      option :favorite, model: "Favorite"

      def call
        entry = favorite.user_collected_entry

        if entry.destroy
          Success true
        else
          Failure[:unprocessable_entity, "Could not unfavorite"]
        end
      end
    end
  end
end
