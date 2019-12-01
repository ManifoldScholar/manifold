module V1
  class ActionCalloutSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    attributes :title,
               :kind,
               :location,
               :position,
               :url,
               :button

    camelized_attributes :attachment_styles

    belongs_to :project
    belongs_to :text
  end
end
