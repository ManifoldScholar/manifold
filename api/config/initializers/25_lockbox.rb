# frozen_string_literal: true

secret_key_base = Rails.env.test? ? Lockbox.generate_key : Rails.application.secret_key_base

# Consistently ensure that it's a 64-character hexadecimal key
enforced_master_key = secret_key_base.gsub(/[^a-zA-Z0-9]+/, "")[/\A([a-zA-Z0-9]{1,64})/, 1].rjust(64, "0")

Lockbox.master_key = enforced_master_key
