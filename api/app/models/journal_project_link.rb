# frozen_string_literal: true

# A view connecting distinct projects within a journal
class JournalProjectLink < ApplicationRecord
  include View

  belongs_to :journal
  belongs_to :project

  scope :in_default_order, -> { order(position: :asc) }
end
