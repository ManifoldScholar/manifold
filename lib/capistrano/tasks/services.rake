# Services
namespace :services do

  services = %w(manifold_client manifold_api manifold_scheduler manifold_workers manifold_cable)

  desc "Stop Services"
  task :start do
    on roles(:app), in: :sequence, wait: 5 do
      services.each { |cmd| execute "sudo systemctl start #{cmd}" }
    end
  end

  desc "Stop Services"
  task :stop do
    on roles(:app), in: :sequence, wait: 5 do
      services.each { |cmd| execute "sudo systemctl stop #{cmd}" }
    end
  end

  desc "Restart Services"
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      services.each { |cmd| execute "sudo systemctl restart #{cmd}" }
    end
  end
end
