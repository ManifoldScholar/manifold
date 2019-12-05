module V1
  class UserSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer
    include ::V1::Concerns::UserAttributes

  end
end
