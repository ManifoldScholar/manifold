# frozen_string_literal: true

module Recoverable
  extend ActiveSupport::Concern

  class_methods do
    def by_reset_token(token)
      return nil unless token.present?

      where(reset_password_token: token).first
    end
  end

  def generate_reset_token(account_link_token: nil)
    self.reset_password_token = SecureRandom.uuid
    self.reset_password_sent_at = Time.now.utc
    send_reset_password_email(account_link_token: account_link_token) if save
  end

  def send_reset_password_email(account_link_token: nil)
    AccountMailer.reset_password(self, account_link_token: account_link_token).deliver
  end

  def update_password(new_password, new_password_confirmation)
    reset_password
    self.password = new_password
    self.password_confirmation = new_password_confirmation
  end

  def reset_password
    self.password = nil
    self.password_confirmation = nil
  end

  def valid_token?(ttl = 1.hour)
    return false unless reset_password_token && reset_password_sent_at

    reset_password_sent_at > Time.now.utc - ttl
  end
end
