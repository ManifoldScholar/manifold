class ProjectCollectionFullSerializer < ProjectCollectionSerializer
  meta(partial: false)

  has_many :subjects, serializer: SubjectSerializer
  has_many :projects, through: :collection_projects
end
