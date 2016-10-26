require "rails_helper"

RSpec.describe CreateEventJob, type: :job do

  describe "#perform" do

    it "creates a new event" do
      project = FactoryGirl.create(:project)
      expect { described_class.new.perform(Event::PROJECT_CREATED, subject: project) }.to change{Event.count}.by(1)
    end

  end

end
