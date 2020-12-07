require "rails_helper"

RSpec.describe Analytics::RecordViewEvent do

  let!(:visit) { FactoryBot.create(:analytics_visit) }
  let(:project) { FactoryBot.create(:project) }
  let(:text) { FactoryBot.create(:text, project: project) }
  let(:text_section) { FactoryBot.create(:text_section, text: text) }

  %w[project text text_section].each do |resource|
    it "should record a view event for a #{resource}" do
      expect do
        described_class.run analytics_visit: visit, record: send(resource)
      end.to change{Analytics::Event.where(name: "view_#{resource}").count}.by 1
    end
  end

end
