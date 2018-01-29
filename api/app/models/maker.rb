# A person or organization involved with the creation of a text
class Maker < ApplicationRecord

  # Constants
  TYPEAHEAD_ATTRIBUTES = [:first_name, :last_name].freeze

  # Concerns
  include Filterable
  include Attachments
  include Authority::Abilities
  include WithParsedName

  # Search
  searchkick word_start: TYPEAHEAD_ATTRIBUTES, callbacks: :async

  # Associations
  has_many :collaborators
  has_many :user_claims
  has_many :users, through: :user_claims

  # Attachments
  manifold_has_attached_file :avatar, :image

  # Misc
  with_parsed_name :first_name, :middle_name, :last_name, :suffix

  def to_s
    full_name
  end

end
