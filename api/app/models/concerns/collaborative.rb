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
  end

  def creator_names
    creator_names_array.join(", ")
  end

  def creator_names_array
    creators.map(&:full_name)
  end
end
