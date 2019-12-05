module V1
  class ContentBlockSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    abilities

    typed_attribute :type, NilClass
    typed_attribute :position, NilClass
    typed_attribute :visible, NilClass
    typed_attribute :incomplete_render_attributes, NilClass
    typed_attribute :configurable, NilClass, &:configurable?
    typed_attribute :orderable, NilClass, &:orderable?
    typed_attribute :hideable, NilClass, &:hideable?
    typed_attribute :renderable, NilClass, &:renderable?

    typed_belongs_to :project
  end
end
