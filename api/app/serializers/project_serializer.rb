# Provides a partial serialization of a project model.
class ProjectSerializer < ProjectPartialSerializer
  has_many :texts, serializer: TextPartialSerializer
  has_many :text_categories, serializer: CategorySerializer
end
