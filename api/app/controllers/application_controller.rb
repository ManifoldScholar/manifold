# The base application controller
class ApplicationController < ActionController::API
  after_action :set_content_type

  private

  def set_content_type
    response.headers["Content-Type"] = "application/vnd.api+json"
  end
end
