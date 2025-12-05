# frozen_string_literal: true

class ExternalIdentifier < ApplicationRecord
  belongs_to :identifiable, polymorphic: true, optional: false

  validates :identifier, presence: true, uniqueness: true

  class << self
    def fetch(identifier)
      find_by(identifier:)
    end
  end
end
