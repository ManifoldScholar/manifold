require Rails.root.join("lib", "patches", "metadown_custom_renderer").to_s
require Rails.root.join("lib", "patches", "better_enums").to_s
require Rails.root.join("lib", "patches", "for_shrine").to_s

# See https://github.com/nahi/httpclient/issues/252
class WebAgent
  class Cookie < HTTP::Cookie
    def domain
      original_domain
    end
  end
end
