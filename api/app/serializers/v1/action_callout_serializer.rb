module V1
  class ActionCalloutSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :title, NilClass
    typed_attribute :kind, NilClass
    typed_attribute :location, NilClass
    typed_attribute :position, NilClass
    typed_attribute :url, NilClass
    typed_attribute :button, NilClass
    typed_attribute :attachment_styles, Hash
    typed_belongs_to :project
    typed_belongs_to :text
  end
end
