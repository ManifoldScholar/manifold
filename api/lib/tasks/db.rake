# frozen_string_literal: true

namespace :db do
  task kill: :environment do
    rails_db_name = ENV["RAILS_DB_NAME"]
    Manifold::Rake.logger.info "Terminating database connections to #{rails_db_name}"
    # rubocop:todo Naming/HeredocDelimiterNaming
    sh = <<EOF
  ps xa \
    | grep postgres: \
    | grep #{rails_db_name} \
    | grep -v grep \
    | awk '{print $1}' \
    | xargs kill
EOF
    # rubocop:enable Naming/HeredocDelimiterNaming
    puts `#{sh}`
  end
end
