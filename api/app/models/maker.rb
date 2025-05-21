# frozen_string_literal: true

# A person or organization involved with the creation of a text
class Maker < ApplicationRecord
  TYPEAHEAD_ATTRIBUTES = [:first_name, :last_name].freeze
  KEYWORD_SEARCH_ATTRIBUTES = %i[first_name middle_name last_name display_name].freeze

  PACKAGING_ATTRIBUTES = %i[id name first_name middle_name last_name display_name suffix prefix].freeze

  PACKAGING_AVATAR_FORMAT = %[%<name>s_%<id>s.%<extension>s]

  include Filterable
  include Attachments
  include Authority::Abilities
  include SerializedAbilitiesFor
  include WithParsedName
  include SearchIndexable
  include HasKeywordSearch

  has_many :collaborators, dependent: :destroy
  has_many :projects,
           through: :collaborators,
           source_type: "Project",
           source: :collaboratable

  manifold_has_attached_file :avatar, :image

  with_parsed_name :prefix, :first_name, :middle_name, :last_name, :suffix

  scope :with_order, ->(by = nil) { by.present? ? order(by) : order(arel_sort_name.asc) }

  validate :name_is_present!

  has_keyword_search! against: KEYWORD_SEARCH_ATTRIBUTES

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
