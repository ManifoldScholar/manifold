class CollectionProject < ApplicationRecord
  include Authority::Abilities
  include Concerns::SerializedAbilitiesFor
  self.authorizer_name = "ProjectChildAuthorizer"

  belongs_to :project_collection, counter_cache: true
  belongs_to :project
  belongs_to :project_summary, foreign_key: :project_id

  # rubocop:disable Rails/HasManyOrHasOneDependent
  # No need to include :dependent option, because this related record comes from a DB view.
  has_one :ranking, class_name: "CollectionProjectRanking", inverse_of: :collection_project
  # rubocop:enable Rails/HasManyOrHasOneDependent
  has_many :creators, through: :project, source: "makers"
  has_many :contributors, through: :project, source: "makers"

  # Ordering
  acts_as_list scope: :project_collection

  # Scopes
  scope :globally_ranked, -> { joins(:ranking).merge(CollectionProjectRanking.globally_ranked) }
  scope :ranked, -> { joins(:ranking).merge(CollectionProjectRanking.ranked) }
  scope :with_order, ->(order) { order(order) if order.present? }

  scope :projects_with_read_ability, lambda { |user = nil|
    next all if user && Project.drafts_readable_by?(user)
    next joins(:project).where(projects: { draft: false }) unless user

    projects_with_update_ability user
  }

  scope :projects_with_update_ability, lambda { |user = nil|
    next none unless user.present?

    joins(:project).where("projects.draft = FALSE OR projects.id IN (?)",
                          Project.authorizer.scope_updatable_projects(user).pluck(:id))
  }

  # Validation
  validates :project, uniqueness: { scope: :project_collection }

  def project_summary_id
    project_id
  end

end
