module MonadicPersistence
  extend ActiveSupport::Concern

  include Dry::Monads[:result]

  # @param [#save] model
  # @return [Dry::Monads::Result]
  def monadic_save(model)
    model.save ? Success(model) : Failure(model)
  end
end
