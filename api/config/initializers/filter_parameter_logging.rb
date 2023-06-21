# Be sure to restart your server when you modify this file.

# Configure sensitive parameters which will be filtered from the log file.
Rails.application.config.filter_parameters += [:email,
                                               :first_name,
                                               :last_name,
                                               :password]

# Let's not log secrets
Rails.application.config.filter_parameters += [:secrets]

# Let's not log uploaded attachments
Rails.application.config.filter_parameters += [
  "source.data",
  "avatar.data",
  "hero.data",
  "cover.data",
  "thumbnail.data",
  "high_res.data",
  "attachment.data",
  "variant_format_one.data",
  "variant_format_two.data",
  "variant_thumbnail.data",
  "variant_poster.data",
  "press_logo.data",
  :passw,
  :secret,
  :token,
  :_key,
  :crypt,
  :salt,
  :certificate,
  :otp,
  :ssn
]
