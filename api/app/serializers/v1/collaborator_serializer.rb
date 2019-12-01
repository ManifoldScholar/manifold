module V1
  class CollaboratorSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    attributes :id, :role
    belongs_to :maker
    belongs_to :collaboratable, polymorphic: true

  end
end
