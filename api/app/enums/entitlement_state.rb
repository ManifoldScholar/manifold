class EntitlementState < ClassyEnum::Base
  applicable!
end

class EntitlementState::Pending < EntitlementState
  def applies_to?(_entitlement)
    false
  end
end

class EntitlementState::ExpiringSoon < EntitlementState
  def applies_to?(entitlement)
    entitlement.should_be_expiring_soon?
  end
end

class EntitlementState::Expired < EntitlementState
  def applies_to?(entitlement)
    entitlement.has_expired?
  end
end

class EntitlementState::Active < EntitlementState
  def applies_to?(entitlement)
    not (entitlement.should_be_expiring_soon? || entitlement.has_expired?)
  end
end
