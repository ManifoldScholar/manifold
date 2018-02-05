# Serializes a Twitter Query model
class TwitterQuerySerializer < ApplicationSerializer
  meta(partial: false)

  attributes :created_at, :updated_at, :query, :active, :events_count, :result_type,
             :display_name
  belongs_to :project
end
