namespace :manifold do
  desc "Upgrades an installation of Manifold to the latest version."
  task :upgrade, [:force] => :environment do |_t, args|
    SystemUpgrades::Perform.run force: args["force"], stdout: true
  end
end
