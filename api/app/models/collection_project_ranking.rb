class CollectionProjectRanking < ApplicationRecord
  include Concerns::View

  belongs_to :collection_project, optional: false
  belongs_to :project_collection
  belongs_to :project

  scope :globally_ranked, -> { reorder(:global_ranking) }
  scope :ranked, -> { reorder(:ranking) }
end
