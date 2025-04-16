# frozen_string_literal: true

namespace :pspec do
  task create: :environment do
    system "RAILS_ENV=test ./bin/rake parallel:create"
  end

  task drop: :environment do
    system "RAILS_ENV=test ./bin/rake parallel:drop"
  end

  task prepare: :environment do
    system "RAILS_ENV=test ./bin/rake parallel:rake[db:schema:load]"
  end

  task failures: :environment do
    system "RAILS_ENV=test ./bin/pspec-failures"
  end
end

task pspec: :environment do
  system "RAILS_ENV=test ./bin/rake parallel:spec"
end
