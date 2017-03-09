# A person or organization involved with the creation of a text
class Maker < ApplicationRecord

  # Constants
  TYPEAHEAD_ATTRIBUTES = [:first_name, :last_name].freeze

  # Concerns
  include Filterable
  include Attachments
  include Authority::Abilities
  include Attachments

  # Search
  searchkick word_start: TYPEAHEAD_ATTRIBUTES, callbacks: :async

  # Associations
  has_many :collaborators
  has_many :user_claims
  has_many :users, through: :user_claims

  # Attachments
  manifold_has_attached_file :avatar, :image

  # Validation
  validates :first_name, presence: true
  validates :last_name, presence: true

  def self.parse_name(name)
    parts = {}
    parts[:first_name] = if name.split.count > 1
                           name.split[0..-2].join(" ")
                         else
                           name
                         end
    parts[:last_name] = name.split.last if name.split.count > 1
    parts
  end

  def name=(name)
    parts = Maker.parse_name(name)
    self.first_name = parts[:first_name]
    self.last_name = parts[:last_name]
  end

  def name
    "#{first_name} #{last_name}"
  end

  def full_name
    [first_name, middle_name, last_name].reject(&:blank?).join(" ")
  end

  def to_s
    full_name
  end

end
