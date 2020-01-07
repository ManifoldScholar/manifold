secret_key_base = Rails.application.secrets.secret_key_base

secret_key_base = secret_key_base.presence || SecureRandom.hex(32) if Rails.env.test?

Lockbox.master_key = secret_key_base
