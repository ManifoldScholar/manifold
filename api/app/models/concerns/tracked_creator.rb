# Model concern that tracks who created a record
module TrackedCreator
  extend ActiveSupport::Concern

  included do
    belongs_to :creator, class_name: "User", foreign_key: "creator_id", optional: true

    delegate :name, to: :creator, prefix: true
  end
end
