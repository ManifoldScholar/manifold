require 'rails_helper'

RSpec.describe ExpireShrineCacheJob, type: :job do
  let!(:shrine_cache) { Shrine.storages[:cache] }

  let(:job) { described_class.new }

  it 'expires the files' do
    allow(shrine_cache).to receive(:clear!)

    expect do
      job.perform
    end.not_to raise_error

    expect(shrine_cache).to have_received(:clear!).once
  end
end
