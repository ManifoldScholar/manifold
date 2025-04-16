# frozen_string_literal: true

module Entitlements
  class GlobalRoleMapping
    include Entitlements::RoleMapping

    define_roles!(&:global_entitlement?)
  end
end
