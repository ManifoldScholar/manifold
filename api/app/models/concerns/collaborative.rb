# Model concern that includes relations to collaborators and scoped relations to creators
# and contributors
module Collaborative
  extend ActiveSupport::Concern
  included do
    has_many :collaborators,
             -> { order(:position) },
             as: :collaboratable, dependent: :destroy, inverse_of: :collaboratable

    # "If you use a hash-style where option, then record creation via this association
    # will be automatically scoped using the hash." -- Love, Rails
    has_many :creator_collaborators,
             -> { where(role: Collaborator::ROLE_CREATOR).order(:position) },
             as: :collaboratable,
             class_name: "Collaborator",
             inverse_of: :collaboratable
    has_many :contributor_collaborators,
             -> { where(role: Collaborator::ROLE_CONTRIBUTOR).order(:position) },
             as: :collaboratable,
             class_name: "Collaborator"

    has_many :makers, through: :collaborators
    has_many :creators, through: :creator_collaborators, source: "maker"
    has_many :contributors, through: :contributor_collaborators, source: "maker"

    scope :with_collaborators, ->(role = nil) { where(id: Collaborator.by_role(role).select(:collaboratable_id)) }
    scope :sans_collaborators, ->(role = nil) { where.not(id: Collaborator.by_role(role).select(:collaboratable_id)) }
  end

  def creator_names
    creator_names_array.join(", ")
  end

  def creator_names_array
    creators.map(&:full_name)
  end

  def collaborator_packaging_metadata
    collaborators.map(&:packaging_metadata)
  end

  def makers_with_avatar_by_role
    hsh = Hash.new do |h, k|
      h[k] = []
    end

    collaborators.each_with_object(hsh) do |collaborator, h|
      next unless collaborator.maker.avatar.present?

      key = collaborator.role.to_s.pluralize

      h[key] << collaborator.maker
    end
  end

  def packaging_maker_avatar_entries(base: "")
    makers_with_avatar_by_role.each_with_object([]) do |(role, makers), tuples|
      makers.each do |maker|
        identifier = :"#{role}_#{maker.id}"

        target_path = File.join(base, role, maker.packaging_avatar_filename)

        attachment = maker.avatar

        tuples << [identifier, target_path, attachment]
      end
    end
  end
end
