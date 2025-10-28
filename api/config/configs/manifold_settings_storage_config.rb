# frozen_string_literal: true

class ManifoldSettingsStorageConfig < ApplicationConfig
  DEFAULT_PATH = "public"
  DEFAULT_TUS_PATH = "data"
  PRIMARY_PREFIX = "system"
  MIRROR_PREFIX = "mirror"
  CACHE_PREFIX = "system/cache"
  TUS_PREFIX = "tus"

  attr_config(
    :mirror,
    :test_bucket,
    :primary_bucket,
    :mirror_bucket,
    :cache_bucket,
    :tus_bucket,
    :tus_prefix,
    primary: "file",
    mirror_path: DEFAULT_PATH,
    primary_path: DEFAULT_PATH,
    tus_path: DEFAULT_TUS_PATH,
    cache_path: DEFAULT_PATH,
    primary_prefix: PRIMARY_PREFIX,
    mirror_prefix: MIRROR_PREFIX,
    cache_prefix: CACHE_PREFIX,
    tus_prefix: TUS_PREFIX
  )

end
