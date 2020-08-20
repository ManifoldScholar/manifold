module Fingerprinted
  extend ActiveSupport::Concern

  def generate_fingerprint(candidates)
    subject = candidates.detect(&:present?)
    return nil if subject.blank?

    Digest::MD5.hexdigest(subject)
  end
end
