namespace :db do
  task kill: :environment do
    rails_db_name = ENV["RAILS_DB_NAME"]
    Manifold::Rake.logger.info "Terminating database connections to #{rails_db_name}"
    sh = <<EOF
  ps xa \
    | grep postgres: \
    | grep #{rails_db_name} \
    | grep -v grep \
    | awk '{print $1}' \
    | xargs kill
EOF
    puts `#{sh}`
  end
end
