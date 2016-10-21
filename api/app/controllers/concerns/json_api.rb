# Includes JSON API related functionality
module JsonApi
  extend ActiveSupport::Concern

  included do
    after_action :set_content_type
  end

  protected

  def set_content_type
    response.headers["Content-Type"] = "application/vnd.api+json"
  end
end
