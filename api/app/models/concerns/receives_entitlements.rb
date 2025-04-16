# frozen_string_literal: true

module ReceivesEntitlements
  extend ActiveSupport::Concern

  included do
    has_many :entitlements, as: :target, dependent: :destroy
  end
end
