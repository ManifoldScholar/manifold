# frozen_string_literal: true

# Model concern that tracks who created a record
module TrackedCreator
  extend ActiveSupport::Concern

  included do
    belongs_to :creator, class_name: "User", optional: true

    delegate :name, to: :creator, prefix: true
  end
end
