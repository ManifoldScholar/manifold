# frozen_string_literal: true

class FlattenedCollaborator < ApplicationRecord
  belongs_to :maker
  belongs_to :collaboratable, polymorphic: true

  delegate :name, to: :maker, prefix: true
  delegate :avatar_styles, to: :maker, prefix: true

  self.primary_key = :id

  def readonly?
    true
  end
end
