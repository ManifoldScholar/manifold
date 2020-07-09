namespace :db do
  task kill: :environment do
    Manifold::Rake.logger.info "Killing all DB connections"
    db_name = "#{File.basename(Rails.root)}_#{Rails.env}"

    sh = <<EOF
  ps xa \
    | grep postgres: \
    | grep #{db_name} \
    | grep -v grep \
    | awk '{print $1}' \
    | xargs kill
EOF
    puts `#{sh}`
  end
end
