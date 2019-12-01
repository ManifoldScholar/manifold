module V1
  class ContentBlockSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer
    include ::V1::Concerns::WithAbilities

    attributes :type,
               :position,
               :visible,
               :incomplete_render_attributes
    attributes :configurable, &:configurable?
    attributes :orderable, &:orderable?
    attributes :hideable, &:hideable?
    attributes :renderable, &:renderable?

    belongs_to :project
  end
end
