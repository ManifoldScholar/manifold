namespace :manifold do
  desc "Upgrades an installation of Manifold to the latest version."
  task :upgrade, [:force] => :environment do |_t, args|
    outcome = SystemUpgrades::Perform.run force: args["force"], stdout: true
    $stdout.puts outcome.result
  end
end
