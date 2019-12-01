module V1
  class TextOptionsSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer
    attributes :title

  end
end
