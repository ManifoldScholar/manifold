# frozen_string_literal: true

class EntitlementMailer < ApplicationMailer
  # @param [User] user
  # @param [Entitlement] entitlement
  def created(user, entitlement)
    @user = user
    @entitlement = entitlement

    @subject_title = ManifoldApi::Container["entitlements.get_subject_title"].(entitlement).value!

    @subject_description = ManifoldApi::Container["entitlements.describe_subject"].(entitlement).value!

    mail to: @user.email, subject: "Access Granted: #{@subject_title}"
  end

  # @param [PendingEntitlement] pending_entitlement
  def pending(pending_entitlement)
    @pending_entitlement = pending_entitlement

    @subject_title = ManifoldApi::Container["entitlements.get_subject_title"].(pending_entitlement).value!

    @subject_description = ManifoldApi::Container["entitlements.describe_subject"].(pending_entitlement).value!

    @identifier = pending_entitlement.first_name.presence || pending_entitlement.email

    mail to: pending_entitlement.email, subject: "You have a pending entitlement on #{@installation_name}"
  end
end
