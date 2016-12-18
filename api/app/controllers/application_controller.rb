
# The base application controller
class ApplicationController < ActionController::API

  include Authentication
  include Validation
  include JsonApi
  include Authority::Controller

  serialization_scope :current_user

  protected

  def page_size
    params.dig(:page, :size) || 20
  end

  def page_number
    params.dig(:page, :number) || 1
  end

  def pagination_dict(object)
    {
      per_page: page_size,
      current_page: object.current_page,
      next_page: object.next_page,
      prev_page: object.prev_page, # use object.previous_page when using will_paginate
      total_pages: object.total_pages,
      total_count: object.total_count
    }
  end

  def respond_with_errors(resource)
    render json: resource.errors, status: :unprocessable_entity
  end

  def respond_with_resource(resource)
    render json: resource
  end

  def build_api_error(title: nil, detail: nil, status: nil)
    [{
      id: "API_ERROR",
      status: status,
      title: title,
      detail: detail
    }]
  end

  def authority_forbidden_resource_class(error)
    vars = { resource: error.resource.to_s.downcase.pluralize, action: error.action }
    options = {
      status: 403,
      title: I18n.t("controllers.errors.forbidden.class.title", vars).titlecase,
      detail: I18n.t("controllers.errors.forbidden.class.detail", vars)
    }
    render json: { errors: build_api_error(options) }, status: 403
  end

  def authority_forbidden_resource_instance(error)
    vars = { resource: error.resource.to_s, action: error.action }
    options = {
      status: 403,
      title: I18n.t("controllers.errors.forbidden.instance.title", vars).titlecase,
      detail: I18n.t("controllers.errors.forbidden.instance.detail", vars)
    }
    render json: { errors: build_api_error(options) }, status: 403
  end

  def authority_forbidden(error)
    Authority.logger.warn(error.message)
    return authority_forbidden_resource_class(error) if error.resource.is_a?(Class)
    authority_forbidden_resource_instance(error)
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
