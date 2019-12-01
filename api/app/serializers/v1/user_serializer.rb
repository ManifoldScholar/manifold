module V1
  class UserSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer
    include ::V1::Concerns::WithAbilities

    attributes :nickname,
               :first_name,
               :last_name,
               :full_name

    camelized_attributes :avatar_styles

    attribute :is_current_user do |object, params|
      next false unless authenticated?(params)

      object.id == params[:current_user]&.id
    end

    private_attributes :email, :created_at, :role, :kind, :updated_at

  end
end
