module Utility
  # Monadic interface to `HTTParty`
  module DryHTTP
    extend Dry::Core::Container::Mixin

    register "get" do
      Utility::DryHTTP::Requestor.new(:get)
    end

    register "head" do
      Utility::DryHTTP::Requestor.new(:head)
    end

    Import = Dry::AutoInject(self)
  end
end
