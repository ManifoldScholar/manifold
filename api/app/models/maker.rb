# A person or organization involved with the creation of a text
class Maker < ApplicationRecord

  # Constants
  TYPEAHEAD_ATTRIBUTES = [:first_name, :last_name].freeze

  # Concerns
  include Filterable
  include Attachments
  include Authority::Abilities
  include Concerns::SerializedAbilitiesFor
  include WithParsedName

  # Associations
  has_many :collaborators, dependent: :destroy
  has_many :projects,
           through: :collaborators,
           source_type: "Project",
           source: :collaboratable

  # Attachments
  manifold_has_attached_file :avatar, :image

  # Misc
  with_parsed_name :first_name, :middle_name, :last_name, :suffix

  # Scopes
  scope :with_order, lambda { |by = nil|
    return order(:last_name, :first_name) unless by.present?
    order(by)
  }

  # Search
  searchkick(word_start: TYPEAHEAD_ATTRIBUTES,
             callbacks: :async,
             batch_size: 500)

  def search_data
    {
      title: full_name,
      body: full_name,
      first_name: first_name,
      middle_name: middle_name,
      last_name: last_name,
      hidden: false
    }
  end

  def to_s
    full_name
  end

end
