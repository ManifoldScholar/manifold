# frozen_string_literal: true

require "rails_helper"

RSpec.describe TextSections::ExtrapolateNodesJob, type: :job do
  let!(:text_section) { FactoryBot.create :text_section }

  it "runs the operation" do
    expect do
      described_class.perform_now text_section
    end.to execute_safely
  end
end
