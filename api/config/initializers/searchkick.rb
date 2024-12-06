# frozen_string_literal: true

Searchkick.search_method_name = :lookup
Searchkick.redis = ManifoldEnv.redis.build_connection_pool("searchkick")

# We do not want searchkick to fill up sidekiq with needless retries.
Searchkick::ReindexV2Job.discard_on Searchkick::ImportError, ActiveJob::DeserializationError, ActiveRecord::RecordNotFound
