# frozen_string_literal: true

require "rails_helper"

RSpec.describe Packaging::BagItSpec::Resources::AttachmentProxy do
  let!(:resource) { FactoryBot.create :resource, :image }

  let!(:resource_proxy) { Packaging::BagItSpec::Resources::Proxy.new resource }
  let!(:attachment_proxy) { resource_proxy.attachments.first }

  subject { attachment_proxy }

  it { is_expected.to have(2).entries }

  its(:entries) { are_expected.to include :file }

  its(:entries) { are_expected.to include :metadata }
end
