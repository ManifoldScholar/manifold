module Entitlements
  # Create an Entitlement
  class Create < AbstractCreate
    object :entitling_entity, class: "ProvidesEntitlements"

    record :subject_url, class: "GlobalID", finder: :new

    validate :find_entitler!
    validate :find_subject!

    # @return [Entitlement]
    def execute
      @entitlement = entitler.entitlements.build subject: subject, target: target

      assign_attributes_to @entitlement

      persist_model! entitlement, assimilate: true
    end

    attr_reader :entitler, :subject

    private

    # @return [void]
    def find_entitler!
      entitling_entity.to_upsertable_entitler.then do |entitler|
        entitler.upsert! unless entitler.persisted?

        @entitler = entitler
      end
    end

    # @return [void]
    def find_subject!
      if subject_url.app.to_s != "entitlements"
        errors.add :subject_url, "must be gid://entitlements"

        return
      end

      @subject = subject_url.find
    rescue ActiveRecord::RecordNotFound => e
      errors.add :subject_url, e.message
    else
      errors.add :subject_url, "does not correspond to a known subject" if @subject.blank?
      errors.add :subject_url, "is not entitleable" unless @subject.is_a?(Entitleable)
    end

  end
end
