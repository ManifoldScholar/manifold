# frozen_string_literal: true

class ExternalIdentifier < ApplicationRecord
  belongs_to :identifiable, polymorphic: true, optional: false

  validates :identifier, presence: true, uniqueness: true
end
