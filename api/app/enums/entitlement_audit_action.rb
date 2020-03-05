class EntitlementAuditAction < ClassyEnum::Base
  def change_role?
    add_role? || remove_role?
  end
end

class EntitlementAuditAction::AddRole < EntitlementAuditAction
end

class EntitlementAuditAction::RemoveRole < EntitlementAuditAction
end

class EntitlementAuditAction::Skip < EntitlementAuditAction
end
