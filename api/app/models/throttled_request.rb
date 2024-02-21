# frozen_string_literal: true

class ThrottledRequest < ApplicationRecord
  class << self
    # @param [Rack::Request] request
    # @return [void]
    def track!(request)
      attributes = extract_attributes_from(request)

      result = ThrottledRequest.upsert_all([attributes], unique_by: %i[ip email matched match_type path], returning: :id)

      id = result.pick("id")

      ThrottledRequest.where(id: id).update_all(occurrences: arel_table[:occurrences] + 1)
    end

    private

    # @return [Hash]
    def extract_attributes_from(request)
      ip = request.ip

      email = AuthToken.real_email_for(request.env["HTTP_AUTHORIZATION"])

      matched = request.env["rack.attack.matched"]

      match_type = request.env["rack.attack.match_type"]

      path = request.path

      {
        ip: ip,
        email: email,
        matched: matched,
        match_type: match_type,
        path: path,
      }.transform_values(&:to_s).merge(last_occurred_at: Time.current)
    end
  end
end
