# frozen_string_literal: true

module Entitlements
  module Types
    include Dry.Types

    ModelInstanceNamed = ->(specific_model) do
      Instance(ActiveRecord::Base).constrained(specific_model: specific_model)
    end

    Subject = Instance(::Entitleable)

    Target = ModelInstanceNamed["User"] | ModelInstanceNamed["ReadingGroup"]

    Subscriber = Coercible::String.constrained(eql: "subscriber")

    Email = String.constrained(email: true)

    ImportSubjectURI = Constructor(GlobalID, GlobalID.method(:parse)).constrained(entitlement_subject_gid: true)

    ImportTargetURI = Constructor(GlobalID, GlobalID.method(:parse)).constrained(entitlement_target_gid: true)

    ImportSubject = Subscriber | ImportSubjectURI | Subject

    ImportTarget = ImportTargetURI | Target
  end
end
