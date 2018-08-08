require 'rails_helper'

RSpec.describe ExpireTusUploadsJob, type: :job do
  let!(:tus_storage) { Tus::Server.opts[:storage] }

  let(:job) { described_class.new }

  it 'expires the files' do
    allow(tus_storage).to receive(:expire_files)

    expect do
      job.perform
    end.not_to raise_error

    expect(tus_storage).to have_received(:expire_files).with(a_kind_of(Time)).once
  end
end
