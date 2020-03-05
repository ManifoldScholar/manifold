# @see SystemEntitlement
class SystemEntitlementKind < ClassyEnum::Base
  def known?
    not unknown?
  end

  class << self
    # @return [<SystemEntitlementKind>]
    def known
      select(&:known?)
    end
  end
end

class SystemEntitlementKind::Subscription < SystemEntitlementKind
end

class SystemEntitlementKind::Unknown < SystemEntitlementKind
end
