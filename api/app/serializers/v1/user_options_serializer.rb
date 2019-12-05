module V1
  class UserOptionsSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :full_name, NilClass
    typed_attribute :last_name, NilClass
    typed_attribute :first_name, NilClass

  end
end
