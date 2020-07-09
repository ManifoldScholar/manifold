module Roles
  class Remove
    include Dry::Monads[:result, :do]

    # @param [User] user
    # @param [RoleName, String, Symbol] role_name
    # @param [ApplicationRecord, Class, nil] resource
    # @return [Dry::Monads::Success(User, Role)]
    # @return [Dry::Monads::Failure(Symbol, String)]
    def call(user, role_name, resource = nil)
      role_name = yield validate_role role_name

      applied_role = yield apply_role user, role_name, resource

      Success[user, applied_role]
    end

    private

    # @param [RoleName, String, Symbol] role_name
    # @return [Dry::Monads::Success(RoleName)]
    # @return [Dry::Monads::Failure(Symbol, String)]
    def validate_role(role_name)
      RoleName[role_name].then do |value|
        value.present? ? Success(value) : Failure[:invalid_role, "#{role_name} is not a known role"]
      end
    end

    # @param [User] user
    # @param [RoleName] role_name
    # @param [ApplicationRecord, Class, nil] resource
    def apply_role(user, role_name, resource)
      user.remove_role(role_name, resource).then do |role|
        Success((role if role.is_a?(::Role)))
      end
    end
  end
end
