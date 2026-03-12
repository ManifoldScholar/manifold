# frozen_string_literal: true

namespace :manifold do
  desc "Performs release tasks - database migration, database reseed, and version upgrade tasks"
  task release: :environment do
    Rake::Task["db:migrate:primary"].invoke
    Rake::Task["db:migrate:cache"].invoke
    Rake::Task["db:seed"].invoke
    Rake::Task["manifold:upgrade"].invoke
  end
end
