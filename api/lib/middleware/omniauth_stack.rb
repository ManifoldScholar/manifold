# Selectively loads middleware required for OmniAuth
# for any path outside of the `/api` namespace.
class OmniauthStack
  def initialize(app)
    @app = app
  end

  def call(env)
    if skip?(env)
      @app.call(env)
    else
      call_with_stack(env)
    end
  end

  def call_with_stack(env)
    middleware_stack.build(@app).call(env)
  end

  def skip?(env)
    env["PATH_INFO"].start_with?("/api/")
  end

  private

  def middleware_stack
    @middleware_stack ||= build_middleware_stack
  end

  def build_middleware_stack
    session_store = Rails.application.config.session_store
    session_options = Rails.application.config.session_options

    ActionDispatch::MiddlewareStack.new.tap do |middleware|
      middleware.use ActionDispatch::Cookies

      middleware.use session_store, session_options

      middleware.use OmniAuth::Builder do
        configure do |config|
          config.full_host = Rails.configuration.manifold.api_url
        end

        ManifoldEnv.oauth.enabled.each do |enabled_provider|
          provider(*enabled_provider.provider_args)
        end
      end
    end
  end
end
