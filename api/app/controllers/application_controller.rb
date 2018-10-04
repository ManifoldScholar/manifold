
# The base application controller
class ApplicationController < ActionController::API

  include Authentication
  include Validation
  include JsonApi
  include Authority::Controller

  serialization_scope :serial_scope

  before_action :set_paper_trail_whodunnit

  rescue_from ApiExceptions::StandardError, with: :render_error_response

  protected

  def user_for_paper_trail
    current_user&.to_global_id.to_s if current_user
  end

  def serial_scope
    @serial_scope ||=
      Api::V1::SerializationContext.new controller: self,
                                        current_user: current_user
  end

  def page_size
    params.dig(:page, :size) || 20
  end

  def page_number
    params.dig(:page, :number) || 1
  end

  def with_pagination!(filter_params)
    filter_params ||= {}
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

  def authority_forbidden_resource_class(error)
    vars = { resource: error.resource.to_s.downcase.pluralize, action: error.action }
    options = {
      status: 403,
      title: I18n.t("controllers.errors.forbidden.class.title", vars).titlecase,
      detail: I18n.t("controllers.errors.forbidden.class.detail", vars)
    }
    render json: { errors: build_api_error(options) }, status: :forbidden
  end

  def authority_forbidden_resource_instance(error)
    vars = { resource: error.resource.to_s, action: error.action }
    options = {
      status: 403,
      title: I18n.t("controllers.errors.forbidden.instance.title", vars).titlecase,
      detail: I18n.t("controllers.errors.forbidden.instance.detail", vars)
    }
    render json: { errors: build_api_error(options) }, status: :forbidden
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
      include Api::V1::Resourceful

      other_options[:authorize] = true
      other_options[:model] = model

      setup_resources!(**other_options, &model_scope)
    end
    # rubocop:enable Lint/UnusedMethodArgument
  end

end
