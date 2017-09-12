# Deploying the client
namespace :client do

  desc "Build client application"
  task :build do
    run_locally do
      within "client" do
        execute :yarn, "run build-tmp"
      end
    end
  end

  desc "Archive client application"
  task :create_archive do
    run_locally do
      execute "tar -C ./tmp -cvf tmp/dist.tar dist"
    end
  end

  desc "Upload client application"
  task :upload_archive do
    on roles(:app), in: :groups, limit: 3, wait: 10 do
      upload! './tmp/dist.tar', "#{release_path}/client/"
    end
  end

  desc "Unpacks the client archive"
  task :unpack_archive do
    on roles(:app), in: :groups, limit: 3, wait: 10 do
      execute "cd #{release_path}/client && tar -xvf ./dist.tar --skip-old-files"
    end
  end

  desc "Destroys the archive on the local and remote hosts"
  task :destroy_archive do
    run_locally do
      execute "rm tmp/dist.tar"
    end
    on roles(:app), in: :groups, limit: 3, wait: 10 do
      execute "rm #{release_path}/client/dist.tar"
    end
  end

  desc "Deploys the client application"
  task :deploy do
    invoke "client:build"
    invoke "client:create_archive"
    invoke "client:upload_archive"
    invoke "client:unpack_archive"
    invoke "client:destroy_archive"
  end

end

