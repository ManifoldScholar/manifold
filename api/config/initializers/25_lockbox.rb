# frozen_string_literal: true

lockbox_master_key = if Rails.env.test?
  Lockbox.generate_key
elsif ENV["LOCKBOX_MASTER_KEY"].present?
  ENV["LOCKBOX_MASTER_KEY"]
else
  Rails.application.secret_key_base
end

# Consistently ensure that it's a 64-character hexadecimal key
enforced_master_key = lockbox_master_key.gsub(/[^a-zA-Z0-9]+/, "")[/\A([a-zA-Z0-9]{1,64})/, 1].rjust(64, "0")

Lockbox.master_key = enforced_master_key
