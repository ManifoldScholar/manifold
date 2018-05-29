class PagePurpose < ClassyEnum::Base
  include ActiveSupport::Configurable

  config.policy = false

  def policy?
    config.policy.present?
  end

  class << self
    def policy
      select(&:policy?)
    end

    def policy!
      config.policy = true
    end
  end
end

# rubocop:disable Style/ClassAndModuleChildren
class PagePurpose::TermsAndConditions < PagePurpose
  policy!
end

class PagePurpose::PrivacyPolicy < PagePurpose
  policy!
end

class PagePurpose::SupplementalContent < PagePurpose; end
# rubocop:enable Style/ClassAndModuleChildren
