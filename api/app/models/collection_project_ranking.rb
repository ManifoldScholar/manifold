class CollectionProjectRanking < ApplicationRecord
  include View

  belongs_to :collection_project, optional: false
  belongs_to :project_collection
  belongs_to :project

  scope :by_collection, ->(collection) { where(project_collection: collection) }
  scope :globally_ranked, -> { reorder(:global_ranking) }
  scope :ranked, -> { reorder(:ranking) }
end
