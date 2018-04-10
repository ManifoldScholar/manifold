# Model concern that tracks who created a record
module TrackedCreator
  extend ActiveSupport::Concern

  included do
    # rubocop:disable Rails/InverseOf
    belongs_to :creator, class_name: "User", foreign_key: "creator_id"
    # rubocop:enable Rails/InverseOf
    delegate :name, to: :creator, prefix: true
  end
end
