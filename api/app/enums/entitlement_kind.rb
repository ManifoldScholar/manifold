class EntitlementKind < ClassyEnum::Base
  applicable!

  # @see Entitlements::RoleMapping#role_names
  # @return [<RoleName>]
  def granted_role_names
    return [] if owner.blank?

    return owner.global_role_names if has_global_roles?
    return owner.scoped_role_names if has_scoped_roles?

    # :nocov:
    []
    # :nocov:
  end

  def has_global_roles?
    kind.global_entitlement?
  end

  def has_scoped_roles?
    kind.scoped_entitlement?
  end

  def kind
    config.kind || RoleKind[:unknown]
  end

  def known?
    not unknown?
  end

  class << self
    private

    def global!
      set_kind! :global_entitlement
    end

    def scoped!
      set_kind! :scoped_entitlement
    end

    def set_kind!(kind)
      config.kind = RoleKind.fetch(kind)
    end
  end
end

class EntitlementKind::Subscription < EntitlementKind
  global!

  # @see Entitlement#for_system_entitlement?
  # @param [Entitlement]
  def applies_to?(entitlement)
    entitlement.for_system_entitlement?(&:subscription?)
  end
end

class EntitlementKind::Journal < EntitlementKind
  scoped!

  def applies_to?(entitlement)
    entitlement.for_journal?
  end
end

class EntitlementKind::Project < EntitlementKind
  scoped!

  # @see Entitlement#for_project_collection?
  # @param [Entitlement]
  def applies_to?(entitlement)
    entitlement.for_project?
  end
end

class EntitlementKind::ProjectCollection < EntitlementKind
  scoped!

  # @see Entitlement#for_project_collection?
  # @param [Entitlement]
  def applies_to?(entitlement)
    entitlement.for_project_collection?
  end
end

class EntitlementKind::Unknown < EntitlementKind
  set_kind! :unknown

  def applies_to?(*)
    true
  end
end
