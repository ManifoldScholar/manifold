module V1
  class PermissionSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :role_names, NilClass

    typed_belongs_to :user
    typed_belongs_to :resource
  end
end
