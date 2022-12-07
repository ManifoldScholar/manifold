# frozen_string_literal: true

GlobalID::Locator.use :entitlements do |gid|
  case gid.model_name
  when "Journal" then Journal.friendly.find gid.model_id
  when "Project" then Project.friendly.find gid.model_id
  when "ProjectCollection" then ProjectCollection.friendly.find gid.model_id
  when "SystemEntitlement"
    case gid.model_id
    when *SystemEntitlementKind
      SystemEntitlement.upsert! kind: gid.model_id
    when UUID.method(:validate)
      SystemEntitlement.find gid.model_id
    end
  end
end
