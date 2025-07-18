# frozen_string_literal: true

class CollectionProject < ApplicationRecord
  include Authority::Abilities
  include SerializedAbilitiesFor
  include ManifoldOAISetLinkSource

  self.authorizer_name = "ProjectChildAuthorizer"

  belongs_to :project_collection, counter_cache: true
  belongs_to :project
  belongs_to_readonly :project_summary, foreign_key: :project_id
  has_one_readonly :ranking, class_name: "CollectionProjectRanking", inverse_of: :collection_project

  has_many :creators, through: :project, source: "makers"
  has_many :contributors, through: :project, source: "makers"
  has_many :subjects, through: :project

  # Ordering
  acts_as_list scope: :project_collection

  scope :globally_ranked, -> { joins(:ranking).merge(CollectionProjectRanking.globally_ranked) }
  scope :ranked, -> { joins(:ranking).merge(CollectionProjectRanking.ranked) }
  scope :with_order, ->(order) { order(order) if order.present? }
  scope :by_collection, ->(collection) { where(project_collection: collection) }

  scope :projects_with_read_ability, ->(user) { joins(:project).merge(Project.with_read_ability(user)) }
  scope :projects_with_update_ability, ->(user) { joins(:project).merge(Project.with_update_ability(user)) }

  # Validation
  validates :project, uniqueness: { scope: :project_collection }

  alias_attribute :project_summary_id, :project_id

  def should_have_oai_set_link?
    project.should_have_oai_record? && project_collection.should_have_oai_set?
  end

  def oai_set
    project_collection.manifold_oai_set
  end

  def oai_record
    project.manifold_oai_record
  end
end
