module Thumbnail
  # This class is responsible for fetching thumbnails for resources
  class Fetcher
    def fetch(resource)
      return unless self.class.accepts?(resource)

      attempt = resource.thumbnail_fetch_attempt ||
                resource.create_thumbnail_fetch_attempt
      reference = remove_params(resource.external_id)
      thumb_url = create_youtube_url(reference) if resource.youtube?
      thumb_url = create_vimeo_url(reference) if resource.vimeo?
      return unless should_attempt?(attempt, reference)

      set_variant_thumbnail(resource, attempt, thumb_url, reference)
    end

    def remove_params(external_id)
      external_id.gsub(/&.*$/, "").gsub(/\?.*$/, "")
    end

    def self.accepts?(resource)
      resource.external_video?
    end

    private

    def should_attempt?(attempt, reference)
      return false if attempt.reference == reference && attempt.attempts > 2

      true
    end

    def create_youtube_url(reference)
      "https://img.youtube.com/vi/#{reference}/hqdefault.jpg"
    end

    def create_vimeo_url(reference)
      response = open("http://vimeo.com/api/v2/video/#{reference}.json").read
      json_response = JSON.parse(response).first
      json_response["thumbnail_medium"]
    end

    def update_attempt(success, attempt, reference)
      attempt.update(
        successful: success,
        attempts: attempt.attempts + 1,
        reference: reference
      )
    end

    def set_variant_thumbnail(resource, attempt, url, reference)
      resource.variant_thumbnail_remote_url = url
      if resource.save
        update_attempt(true, attempt, reference)
        Rails.logger.info("Thumbnail fetch successful for #{resource.id}")
      end
    rescue OpenURI::HTTPError
      update_attempt(false, attempt, reference)
      Rails.logger.info("Thumbnail fetch failed for #{resource.id}")
    end
  end
end
