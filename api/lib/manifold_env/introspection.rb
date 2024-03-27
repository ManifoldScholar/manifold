# frozen_string_literal: true

require "auth_token"

module ManifoldEnv
  # @see ManifoldEnv::Introspector
  class Introspection
    EMPTY_PARAMS = {}.with_indifferent_access.freeze

    JSON_MIME = %r{application/json}.freeze

    # @return [Boolean]
    attr_reader :authorized_admin

    alias authorized_admin? authorized_admin

    # @return [String, nil]
    attr_reader :authorized_real_email

    # @return [String]
    attr_reader :controller_action

    # @return [ActiveSupport::HashWithIndifferentAccess]
    attr_reader :params

    # @return [Boolean]
    attr_reader :rate_limiting_disabled

    alias rate_limiting_disabled? rate_limiting_disabled

    # @return [String, nil]
    attr_reader :real_email

    # @return [Rack::Request]
    attr_reader :request

    # @return [ManifoldEnv::Types::ThrottledCategory]
    attr_reader :throttled_category

    # @return [ManifoldEnv::Introspection::Throttled]
    attr_reader :throttled

    # @param [Hash] env
    def initialize(env = {})
      @request = Rack::Request.new(env)
      @params = parse_json_params
      @authorized_admin = request.get? ? nil : AuthToken.authorized_admin?(request.env["HTTP_AUTHORIZATION"])
      @authorized_real_email = request.get? ? nil : AuthToken.real_email_for(request.env["HTTP_AUTHORIZATION"]).presence
      @real_email = authorized_real_email

      @controller_action = derive_controller_action

      self.throttled_category = derive_throttled_category

      if throttled.registration?
        @real_email = AuthToken.real_email_from(params.dig("data", "attributes", "email"))
      end

      @rate_limiting_disabled = derive_rate_limiting_disabled
    end

    # @param [Hash] env
    # @return [void]
    def attach!(env)
      env["manifold_env.introspection"] = self
      env["manifold_env.authorized_admin"] = authorized_admin?
      env["manifold_env.params"] = params
      env["manifold_env.rate_limiting_disabled"] = rate_limiting_disabled?
      env["manifold_env.real_email"] = real_email
      env["manifold_env.throttled"] = throttled
      env["manifold_env.throttled_category"] = throttled_category
    end

    # @param [ManifoldEnv::Types::ThrottledCategory] new_value
    def throttled_category=(new_value)
      @throttled_category = ManifoldEnv::Types::ThrottledCategory[new_value]
      @throttled = Throttled.new(throttled_category)
    end

    private

    def derive_controller_action
      result = Rails.application.routes.recognize_path request.path, method: request.request_method

      controller, action = result.values_at(:controller, :action)

      "#{controller}##{action}"
    rescue ActionController::RoutingError
      # :nocov:
      "unknown#action"
      # :nocov:
    end

    # @return [Boolean]
    def derive_rate_limiting_disabled
      return true if throttled.none?

      Settings.current.rate_limiting.disabled_for?(:registration)
    rescue ActiveRecord::NoDatabaseError, PG::UndefinedTable
      # If settings are unavailable because of migrations / etc,
      # assume rate limiting is enabled by default.
      # :nocov:
      return false
      # :nocov:
    end

    def derive_throttled_category
      return :none unless request.post?

      catch(:throttled) do
        match_throttled!(:comment_creation, "api/v1/comments#create")

        match_throttled!(:public_annotation_creation, "api/v1/text_sections/relationships/annotations#create") do
          params.dig("data", "attributes", "private").blank?
        end

        match_throttled!(:public_reading_group_creation, "api/v1/reading_groups#create") do
          params.dig("data", "attributes", "privacy") != "private"
        end

        match_throttled!(:registration, "api/v1/users#create")

        :none
      end
    end

    def match_throttled!(category, *controller_actions)
      controller_actions.flatten!

      return if controller_actions.present? && !controller_action.in?(controller_actions)

      return if block_given? && yield.blank?

      throw :throttled, category
    end

    # @return [ActiveSupport::HashWithIndifferentAccess]
    def parse_json_params
      return EMPTY_PARAMS if request.get?

      params = JSON.parse(request.body)

      params.try(:with_indifferent_access) || EMPTY_PARAMS
    rescue JSON::ParserError
      EMPTY_PARAMS
    ensure
      request.body.rewind
    end

    def skip_param_parsing?
      request.get? || !JSON_MIME.match?(request.content_type)
    end

    class Throttled
      include Dry::Core::Equalizer.new(:category)
      include Dry::Initializer[undefined: false].define -> do
        param :category, ManifoldEnv::Types::ThrottledCategory
      end

      ManifoldEnv::Types::ThrottledCategory.values.each do |category|
        class_eval <<~RUBY, __FILE__, __LINE__ + 1
        def #{category}?                  # def comment?
          category == #{category.inspect} #   category == :comment
        end                               # end
        RUBY
      end
    end
  end
end
