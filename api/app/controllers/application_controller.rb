require "naught"

# The base application controller
class ApplicationController < ActionController::API

  include Authentication
  include Validation
  include JSONAPI
  include Authority::Controller

  before_action :set_paper_trail_whodunnit

  rescue_from APIExceptions::StandardError, with: :render_error_response

  protected

  def authority_user
    @authority_user ||= current_user || anonymous_user
  end

  # rubocop:disable Lint/NestedMethodDefinition
  def anonymous_user
    @anonymous_user ||= Naught.build do |config|
      config.impersonate User
      config.predicates_return false

      def role
        nil
      end

      def kind
        nil
      end

      def can_read?(resource, *other)
        resource.readable_by? self, *other
      end
    end.new
  end
  # rubocop:enable Lint/NestedMethodDefinition

  def user_for_paper_trail
    current_user&.to_global_id.to_s if current_user
  end

  def page_size
    params.dig(:page, :size) || 20
  end

  def page_number
    params.dig(:page, :number) || 1
  end

  def with_pagination!(filter_params = {})
    filter_params = {} if filter_params.nil?
    return filter_params if params.dig(:no_pagination)

    filter_params[:page] = page_number
    filter_params[:per_page] = page_size
    filter_params
  end

  def pagination_dict(object)
    {
      per_page: page_size.to_i,
      current_page: object.current_page.to_i,
      next_page: object.next_page.to_i,
      prev_page: object.prev_page.to_i,
      total_pages: object.total_pages.to_i,
      total_count: object.total_count.to_i
    }
  end

  def respond_with_errors(resource)
    render json: resource.errors, status: :unprocessable_entity
  end

  def respond_with_resource(resource)
    render json: resource
  end

  def authorization_error_status(symbol: false)
    if current_user
      return :forbidden if symbol

      return 403
    end
    return :unauthorized if symbol

    401
  end

  def authority_forbidden_resource_class(error)
    vars = { resource: error.resource.to_s.downcase.pluralize, action: error.action }
    options = {
      status: authorization_error_status,
      title: I18n.t("controllers.errors.forbidden.class.title", vars).titlecase,
      detail: I18n.t("controllers.errors.forbidden.class.detail", vars)
    }
    render json: { errors: build_api_error(options) }, status: authorization_error_status(symbol: true)
  end

  def authority_forbidden_resource_instance(error)
    vars = { resource: error.resource.to_s, action: error.action }
    options = {
      status: authorization_error_status,
      title: I18n.t("controllers.errors.forbidden.instance.title", vars).titlecase,
      detail: I18n.t("controllers.errors.forbidden.instance.detail", vars),
      project: error_project_details(error)
    }
    render json: { errors: build_api_error(options) }, status: authorization_error_status(symbol: true)
  end

  def respond_with_forbidden(resource, action)
    vars = { resource: resource, action: action }
    options = {
      status: authorization_error_status,
      title: I18n.t("controllers.errors.forbidden.instance.title", vars).titlecase,
      detail: I18n.t("controllers.errors.forbidden.instance.detail", vars)
    }
    render json: { errors: build_api_error(options) }, status: authorization_error_status(symbol: true)
  end

  def resource_not_found
    options = {
      status: 404,
      title: I18n.t("controllers.errors.not_found.title").titlecase,
      detail: I18n.t("controllers.errors.not_found.detail")
    }
    render json: { errors: build_api_error(options) }, status: :not_found
  end

  def authority_forbidden(error)
    Authority.logger.warn(error.message)
    return authority_forbidden_resource_class(error) if error.resource.is_a?(Class)

    authority_forbidden_resource_instance(error)
  end

  def render_error_response(error)
    options = {
      status: 500,
      title: "Manifold encountered an error",
      detail: error.message
    }
    render json: { errors: build_api_error(options) }, status: :internal_server_error
  end

  private

  def error_project_details(error)
    project = nil
    project = error.resource if error.resource.is_a?(Project)
    project = error.resource.project if error.resource.respond_to?(:project)
    if project&.readable_by?(authority_user)
      return {
        id: project.id,
        slug: project.slug,
        title: project.title,
        titleFormatted: project.title_formatted
      }
    end
    nil
  end

  class << self
    # Define the calling controller as a resource, adding several methods
    # to simplify rendering and accepting JSONAPI resources.
    #
    # @param [ActiveRecord::Base] model
    # @param [Boolean] authorize
    # @yieldreturn [ActiveRecord::Relation]
    # @return [void]
    # rubocop:disable Lint/UnusedMethodArgument
    def resourceful!(model, authorize: true, **other_options, &model_scope)
      include API::V1::Resourceful

      other_options[:authorize] = true
      other_options[:model] = model

      setup_resources!(**other_options, &model_scope)
    end
    # rubocop:enable Lint/UnusedMethodArgument
  end

end
