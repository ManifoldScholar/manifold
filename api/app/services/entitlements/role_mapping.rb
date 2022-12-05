module Entitlements
  module RoleMapping
    extend ActiveSupport::Concern

    include ActiveSupport::Configurable

    TYPE = ::Types::Coercible::Hash.map(::Types::ENUM_OF_TYPE[RoleName], ::Types::Bool.default { false })

    included do
      include StoreModel::Model

      config.managed_roles = []

      config_accessor :managed_roles, instance_writer: false
    end

    def any?
      managed_roles.any? do |role_name|
        public_send(role_name.to_sym)
      end
    end

    # @param [Symbol, String, RoleName] role_name
    def has?(role_name)
      raise ArgumentError, "Unknown entitlement role: #{role_name.inspect}" unless role_name.in?(managed_roles)

      public_send(role_name).present?
    end

    def none?
      managed_roles.none? do |role_name|
        public_send(role_name.to_sym)
      end
    end

    # @return [<RoleName>]
    def role_names
      managed_roles.select do |role_name|
        public_send(role_name.to_sym)
      end
    end

    class_methods do
      # @return [void]
      def define_roles!
        raise "Must specify a conditional block!" unless block_given?

        found_roles = RoleName.select do |role|
          next unless role.entitlement?
          next if role.in? managed_roles

          yield role
        end

        found_roles.each do |role|
          attribute role.to_sym, :boolean, default: false

          alias_method role.predicate_name, role.to_sym
        end

        config.managed_roles = [*config.managed_roles, *found_roles]
      end
    end
  end
end
