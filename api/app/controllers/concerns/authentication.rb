require "exceptions"
require "auth_token"

# Includes authentication related functionality
module Authentication
  extend ActiveSupport::Concern

  included do
    before_action :load_current_user
    rescue_from ActionController::RoutingError, with: :resource_not_found
    rescue_from AuthenticationTimeoutError, with: :authentication_timeout
    rescue_from NotAuthenticatedError, with: :user_not_authenticated
    rescue_from Authority::MissingUser, with: :user_not_authenticated
  end

  CURRENT_USER_PRELOADS = %w(roles makers favorites).freeze

  protected

  def load_current_user
    @current_user = User.preload(CURRENT_USER_PRELOADS).find(decoded_auth_token[:user_id])
  rescue JWT::DecodeError
    nil
  end

  def current_user
    @current_user
  end

  # This method gets the current user based on the user_id included
  # in the Authorization header (json web token).
  #
  # Call this from child controllers in a before_action or from
  # within the action method itself
  def authenticate_request!
    raise NotAuthenticatedError unless user_id_included_in_auth_token?
    @current_user = User.preload(CURRENT_USER_PRELOADS).find(decoded_auth_token[:user_id])
  rescue JWT::ExpiredSignature
    raise AuthenticationTimeoutError
  rescue JWT::VerificationError, JWT::DecodeError
    raise NotAuthenticatedError
  end

  private

  # Authentication Related Helper Methods
  # ------------------------------------------------------------
  def user_id_included_in_auth_token?
    http_auth_token && decoded_auth_token && decoded_auth_token[:user_id]
  end

  # Decode the authorization header token and return the payload
  def decoded_auth_token
    @decoded_auth_token ||= AuthToken.decode(http_auth_token)
  end

  # Raw Authorization Header token (json web token format)
  # JWT's are stored in the Authorization header using this format:
  # Bearer somerandomstring.encoded-payload.anotherrandomstring
  def http_auth_token
    @http_auth_token ||= if request.headers["Authorization"].present?
                           request.headers["Authorization"].split(" ").last
                         end
  end

  # Returns user with auth token
  def render_authenticated_user(user)
    if user
      render json: user,
             serializer: CurrentUserSerializer,
             meta: { authToken: AuthToken.encode(user_id: user.id) },
             include: %w(favorites)
    else
      render json: { errors: ["Invalid username or password"] }, status: :unauthorized
    end
  end

  # Helper Methods for responding to errors
  # ------------------------------------------------------------
  def build_api_error(title: nil, detail: nil, status: nil)
    [
      {
        id: "API_ERROR",
        status: status,
        title: title,
        detail: detail
      }
    ]
  end

  def authentication_timeout
    options = {
      status: 419,
      title: I18n.t("controllers.errors.auth_timeout.title").titlecase,
      detail: I18n.t("controllers.errors.auth_timeout.detail")
    }
    render json: { errors: build_api_error(options) }, status: 419
  end

  def forbidden_resource
    options = {
      status: 403,
      title: I18n.t("controllers.errors.forbidden_generic.title").titlecase,
      detail: I18n.t("controllers.errors.forbidden_generic.detail")
    }
    render json: { errors: build_api_error(options) }, status: 403
  end

  def user_not_authenticated
    options = {
      status: 401,
      title: I18n.t("controllers.errors.unauthorized.title").titlecase,
      detail: I18n.t("controllers.errors.unauthorized.detail")
    }
    render json: { errors: build_api_error(options) }, status: :unauthorized
  end
end
