# frozen_string_literal: true

module TestHelpers
  module Akismet
    COMMENT_CHECK_URL = "https://rest.akismet.com/1.1/comment-check"

    SUBMIT_SPAM_URL = "https://rest.akismet.com/1.1/submit-spam"

    COMMON_HEADERS = {
      "Content-Type" => "text/plain; charset=utf-8",
    }.freeze

    AKISMET_ERROR_MESSAGE = "Something went wrong"

    # @param [Symbol] situation
    # @return [void]
    def akismet_stub_comment_check!(situation: :not_spam)
      options = { headers: COMMON_HEADERS, status: 200 }

      case situation
      when :not_spam
        options[:body] = "false"
      when :spam
        options[:body] = "true"
      else
        options[:status] = 400
        options[:body] = AKISMET_ERROR_MESSAGE
      end

      stub_request(:post, COMMENT_CHECK_URL).to_return(**options)
    end

    # @param [Symbol] situation
    # @return [void]
    def akismet_stub_submit_spam!(situation: :ok)
      options = { headers: COMMON_HEADERS, status: 200 }

      case situation
      when :ok
        options[:body] = "Thanks for making the web a better place."
      else
        options[:status] = 400
        options[:body] = AKISMET_ERROR_MESSAGE
      end

      stub_request(:post, SUBMIT_SPAM_URL).to_return(**options)
    end

    def spam_detection_enabled!
      settings = Settings.current

      settings.general.disable_spam_detection = false

      settings.save!
    end

    def spam_detection_disabled!
      settings = Settings.current

      settings.general.disable_spam_detection = true

      settings.save!
    end

    def akismet_enabled!
      spam_detection_enabled!

      settings = Settings.current

      settings.secrets.akismet_api_key = "123456"

      settings.save!
    end

    def akismet_disabled!
      settings = Settings.current

      settings.secrets.akismet_api_key = nil

      settings.save!
    end
  end
end

# We ensure that akismet is stubbed globally with the safest
# strategies, so as to not impact the creation of records that
# use the new validations.
RSpec.shared_context "akismet defaults" do
  before do
    akismet_stub_comment_check!(situation: :not_spam)
    akismet_stub_submit_spam!(situation: :ok)
  end
end

RSpec.configure do |config|
  config.include TestHelpers::Akismet
  config.include_context "akismet defaults"
end
