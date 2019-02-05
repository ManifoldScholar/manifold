# Job to fetch youtube and vimeo thumbnails in the background.
class FetchResourceThumbnail < ApplicationJob
  queue_as :low_priority

  rescue_from(ActiveRecord::RecordNotFound) do |exception|
    Rails.logger.info("Could not fetch thumbnail for resource #{exception.id} because " \
    "resource was not found.")
  end

  def perform(resource_id)
    resource = Resource.find(resource_id)
    return unless resource

    Thumbnail::Fetcher.new.fetch(resource)
  end
end
