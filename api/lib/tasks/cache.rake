# frozen_string_literal: true

namespace :manifold do
  namespace :cache do
    desc "Prime Manifold caches"
    task prime: :environment do
      FormattedAttributes::RefreshAllCachesJob.perform_later
    end
  end
end
