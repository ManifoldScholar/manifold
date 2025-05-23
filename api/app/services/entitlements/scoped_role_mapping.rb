# frozen_string_literal: true

module Entitlements
  class ScopedRoleMapping
    include Entitlements::RoleMapping

    define_roles!(&:scoped_entitlement?)
  end
end
