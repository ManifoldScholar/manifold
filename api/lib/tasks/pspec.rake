namespace :pspec do
  task :create do
    system "RAILS_ENV=test ./bin/rake parallel:create"
  end

  task :drop do
    system "RAILS_ENV=test ./bin/rake parallel:drop"
  end

  task :prepare do
    system "RAILS_ENV=test ./bin/rake parallel:rake[db:schema:load]"
  end

  task :failures do
    system "RAILS_ENV=test ./bin/pspec-failures"
  end
end

task :pspec do
  system "RAILS_ENV=test ./bin/rake parallel:spec"
end
