# frozen_string_literal: true

# Preview all emails at http://manifold.lvh/rails/mailers/entitlement
class EntitlementPreview < ActionMailer::Preview
  # Preview this email at http://manifold.lvh/rails/mailers/entitlement/created
  def created
    user = User.first!
    entitlement = Entitlement.first!

    EntitlementMailer.created user, entitlement
  rescue ActiveRecord::RecordNotFound
    raise "Create a user and an entitlement before previewing the created mailer"
  end

  # Preview this email at http://manifold.lvh/rails/mailers/entitlement/pending
  def pending
    pending_entitlement = PendingEntitlement.first!

    EntitlementMailer.pending pending_entitlement
  rescue ActiveRecord::RecordNotFound
    raise "Create a pending entitlement before previewing the pending mailer"
  end
end
