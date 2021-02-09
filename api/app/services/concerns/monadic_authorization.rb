module MonadicAuthorization
  extend ActiveSupport::Concern

  included do
    include ManifoldApi::Deps["utility.inspect_model"]
  end

  include Dry::Monads[:result]
  include MonadicJSONAPIErrors

  def action_authorized(action, object, user, options = {})
    return Failure[:unauthorized, "must be signed in"] unless user.present?

    if Authority.action_authorized?(action, object, user, options)
      Success true
    else
      forbidden_jsonapi_error(
        code: "not_authorized",
        title: "Not Authorized",
        detail: "cannot #{action} #{inspect_model.call(object)}"
      )
    end
  end
end
