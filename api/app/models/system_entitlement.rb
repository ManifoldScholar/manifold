# This is a proxy object that represents a global system entitlement.
#
# Currently, there's only one, {SystemEntitlementKind::Subscription subscription},
# which corresponds to {RoleName::Subscriber subscriber}.
class SystemEntitlement < ApplicationRecord
  include Entitleable

  upsert_keys %i[kind]

  classy_enum_attr :kind, enum: "SystemEntitlementKind", allow_blank: false

  resourcify

  validates :kind, uniqueness: { on: :update }
  validate :must_be_known!

  delegate :known?, *SystemEntitlementKind.predicates, to: :kind

  private

  # @return [void]
  def must_be_known!
    errors.add :kind, "must be known" unless known?
  end

  class << self
    # @param [SystemEntitlementKind] provided_kind
    # @raise [ActiveRecord::RecordNotFound] on an invalid kind
    # @return [SystemEntitlement]
    def fetch(provided_kind)
      kind = SystemEntitlementKind.fetch(provided_kind, default: :unknown)

      if kind.unknown?
        message = "Unknown kind: #{provided_kind.inspect}"

        raise ActiveRecord::RecordNotFound.new(message, self, :kind, provided_kind)
      end

      upsert! kind: kind
    end
  end
end
