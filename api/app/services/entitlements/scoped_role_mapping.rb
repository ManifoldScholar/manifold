module Entitlements
  class ScopedRoleMapping
    include Entitlements::RoleMapping

    define_roles!(&:scoped_entitlement?)
  end
end
