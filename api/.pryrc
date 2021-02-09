def testing_client(user: User.cli_user)
  Testing::ManifoldClient.new user: user
end
