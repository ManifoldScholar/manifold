# frozen_string_literal: true

module RendersInIframe
  extend ActiveSupport::Concern

  included do
    content_security_policy do |policy|
      policy.frame_ancestors :self, "http://web.canvas.orb.local"
    end

    after_action :set_frame_options, if: :allow_iframe?
  end

  class_methods do
    def allow_iframe!(*actions)
      @allow_iframe = (actions.presence || [:all]).map(&:to_sym).index_with { true }
    end

    def allow_iframe?(action = :all)
      (@allow_iframe ||= {})[action.to_sym] || false
    end
  end

  private

  # By default, do not allow embedding
  # Override as necessary
  def allow_iframe?
    true
  end

  def set_frame_options
    response.headers["X-Frame-Options"] = "ALLOW-FROM #{request.referer}"
  end
end
