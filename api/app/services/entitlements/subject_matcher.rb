module Entitlements
  project = Dry::Matcher::Case.new do |entitlement, _|
    if entitlement.for_project?
      [entitlement.subject, entitlement]
    else
      Dry::Matcher::Undefined
    end
  end

  project_collection = Dry::Matcher::Case.new do |entitlement, _|
    if entitlement.for_project_collection?
      [entitlement.subject, entitlement]
    else
      Dry::Matcher::Undefined
    end
  end

  system_entitlement = Dry::Matcher::Case.new do |entitlement, _|
    if entitlement.for_system_entitlement?
      [entitlement.subject, entitlement]
    else
      Dry::Matcher::Undefined
    end
  end

  SubjectMatcher = Dry::Matcher.new(
    project: project,
    project_collection: project_collection,
    system_entitlement: system_entitlement
  )
end
