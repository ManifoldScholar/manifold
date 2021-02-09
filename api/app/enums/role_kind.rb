class RoleKind < ClassyEnum::Base
  def entitlement?
    config.entitlement.present?
  end

  def has_expected_resource?
    config.has_expected_resource.present?
  end

  def valid?
    not unknown?
  end

  class << self
    def entitlement!
      config.entitlement = true
    end

    # rubocop:disable Naming/PredicateName
    def has_expected_resource!
      config.has_expected_resource = true
    end
    # rubocop:enable Naming/PredicateName
  end
end

class RoleKind::Global < RoleKind
end

class RoleKind::Scoped < RoleKind
  has_expected_resource!
end

class RoleKind::GlobalEntitlement < RoleKind
  entitlement!
end

class RoleKind::ScopedEntitlement < RoleKind
  entitlement!

  has_expected_resource!
end

class RoleKind::ReadingGroup < RoleKind
  has_expected_resource!
end

class RoleKind::Unknown < RoleKind
end
