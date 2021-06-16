# A person or organization involved with the creation of a text
class Maker < ApplicationRecord
  # Constants
  TYPEAHEAD_ATTRIBUTES = [:first_name, :last_name].freeze

  PACKAGING_ATTRIBUTES = %i[id name first_name middle_name last_name display_name suffix prefix].freeze

  PACKAGING_AVATAR_FORMAT = %[%<name>s_%<id>s.%<extension>s].freeze

  # Concerns
  include Filterable
  include Attachments
  include Authority::Abilities
  include SerializedAbilitiesFor
  include WithParsedName
  include SearchIndexable

  # Associations
  has_many :collaborators, dependent: :destroy
  has_many :projects,
           through: :collaborators,
           source_type: "Project",
           source: :collaboratable

  # Attachments
  manifold_has_attached_file :avatar, :image

  # Misc
  with_parsed_name :prefix, :first_name, :middle_name, :last_name, :suffix

  # Scopes
  scope :with_order, ->(by = nil) { by.present? ? order(by) : order(arel_sort_name.asc) }

  validate :name_is_present!

  # Search
  searchkick(word_start: TYPEAHEAD_ATTRIBUTES,
             callbacks: :async,
             batch_size: 500)

  def search_data
    {
      search_result_type: search_result_type,
      title: full_name,
      first_name: first_name,
      middle_name: middle_name,
      last_name: last_name,
      hidden: false
    }
  end

  def to_s
    full_name
  end

  def packaging_avatar_filename
    return unless avatar?

    parameters = {
      id: id,
      name: name.to_s.parameterize.presence || "maker",
      extension: avatar.extension
    }

    filename = PACKAGING_AVATAR_FORMAT % parameters

    Zaru.sanitize! filename
  end

  def packaging_metadata
    slice(*PACKAGING_ATTRIBUTES).compact
  end

  class << self
    def arel_coalesce(*args)
      args.map! { |arg| Arel::Nodes.build_quoted(arg) }

      Arel::Nodes::NamedFunction.new("COALESCE", args)
    end

    def arel_sort_name
      last_name = arel_coalesce(arel_table[:last_name], "")
      first_name = arel_coalesce(arel_table[:first_name], "")

      Arel::Nodes::Concat.new(last_name, first_name)
    end
  end

  private

  def name_is_present!
    return true if first_name.present? || last_name.present?

    errors.add(:base, "requires at least a first or last name")
  end
end
