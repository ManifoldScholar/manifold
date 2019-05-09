[
  "metadown_custom_renderer",
  "better_enums",
  "simpler_params_casting",
  "better_interactions",
  "for_shrine",
  "friendly_id_uniqueness"
].each do |patch_name|
  require Rails.root.join("lib", "patches", patch_name).to_s
end

# See https://github.com/nahi/httpclient/issues/252
class WebAgent
  class Cookie < HTTP::Cookie
    def domain
      original_domain
    end
  end
end
