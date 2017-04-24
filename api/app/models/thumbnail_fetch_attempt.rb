# Tracks attempts made by Thumbnail::Fetcher
class ThumbnailFetchAttempt < ApplicationRecord

  # Association
  belongs_to :resource

end
