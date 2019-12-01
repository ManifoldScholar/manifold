module V1
  class PermissionSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer
    attributes :role_names

    belongs_to :user
    belongs_to :resource
  end
end
