module V1
  class UserOptionsSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    attributes :full_name,
               :last_name,
               :first_name

  end
end
