# frozen_string_literal: true

namespace :manifold do
  namespace :search do
    desc "Reindex searchable models."
    task reindex: :environment do
      ManifoldApi::Container["search.rebuild_all"].().value!
    end
  end
end
