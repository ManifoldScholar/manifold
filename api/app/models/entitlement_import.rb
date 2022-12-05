# frozen_string_literal: true

class EntitlementImport < ApplicationRecord
  include CSVUploader::Attachment.new(:file)
  include Authority::Abilities
  include HasStateMachine
  include ProvidesEntitlements
  include SerializedAbilitiesFor
  include TrackedCreator

  has_many :entitlement_import_rows, -> { in_order }, dependent: :destroy,
    inverse_of: :entitlement_import

  has_state_machine! initial_state: :pending

  before_validation :set_name!, unless: :name?

  alias file_name file_file_name

  validates :file, :name, presence: true

  private

  # @return [void]
  def set_name!
    self.name = "Entitlement Import (#{file_name})"
  end
end
