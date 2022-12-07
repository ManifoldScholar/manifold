# frozen_string_literal: true

# Tracks the relationship between journals and subjects
class JournalSubject < ApplicationRecord
  include Authority::Abilities
  include SerializedAbilitiesFor

  self.authorizer_name = "JournalChildAuthorizer"

  # Association
  belongs_to :journal
  belongs_to :subject

  # Scopes
  scope :by_subject, ->(subject) { where(subject: subject) if subject.present? }

  def to_s
    subject.title
  end
end
