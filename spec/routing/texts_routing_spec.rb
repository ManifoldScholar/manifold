require "rails_helper"

RSpec.describe TextsController, :type => :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/texts").to route_to("texts#index")
    end

    it "routes to #new" do
      expect(:get => "/texts/new").to route_to("texts#new")
    end

    it "routes to #show" do
      expect(:get => "/texts/1").to route_to("texts#show", :id => "1")
    end

    it "routes to #edit" do
      expect(:get => "/texts/1/edit").to route_to("texts#edit", :id => "1")
    end

    it "routes to #create" do
      expect(:post => "/texts").to route_to("texts#create")
    end

    it "routes to #update" do
      expect(:put => "/texts/1").to route_to("texts#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/texts/1").to route_to("texts#destroy", :id => "1")
    end

  end
end
