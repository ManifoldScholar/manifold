module Roles
  class Add
    include Dry::Monads[:result, :do]

    # @param [User] user
    # @param [RoleName] role_name
    # @param [ApplicationRecord, Class, nil] resource
    # @return [Dry::Monads::Success(User, Role)]
    # @return [Dry::Monads::Failure(Symbol, String)]
    def call(user, role_name, resource = nil)
      role_name = yield validate_role role_name

      applied_role = yield apply_role user, role_name, resource

      Success[user, applied_role]
    end

    private

    def validate_role(role_name)
      RoleName[role_name].then do |value|
        value.present? ? Success(value) : Failure[:invalid_role, "#{role_name} is not a known role"]
      end
    end

    def apply_role(user, role_name, resource)
      user.add_role(role_name, resource).then do |role|
        return Success(role) if role.valid?

        return Failure[:invalid_role, "Could not save role: #{role.flattened_errors}"]
      end
    end
  end
end
