namespace :install do
  desc "Creates a Manifold user admin@manifold.dev / manifold"
  task create_user: :environment do
    u = User.find_or_create_by(email: "admin@manifold.dev")
    u.role = "reader"
    u.password = "manifold"
    u.password_confirmation = "manifold"
    u.save
  end
end
