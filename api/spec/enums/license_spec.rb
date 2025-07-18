# frozen_string_literal: true

RSpec.describe License, type: :enum do
  subject { described_class.new }

  describe License::CcBy do
    its(:label) { is_expected.to eq "CC BY" }
  end

  describe License::CcByNc do
    its(:label) { is_expected.to eq "CC BY-NC" }
  end

  describe License::CcByNcSa do
    its(:label) { is_expected.to eq "CC BY-NC-SA" }
  end

  describe License::CcByNcNd do
    its(:label) { is_expected.to eq "CC BY-NC-ND" }
  end

  describe License::CcBySa do
    its(:label) { is_expected.to eq "CC BY-SA" }
  end

  describe License::CcByNd do
    its(:label) { is_expected.to eq "CC BY-ND" }
  end

  describe License::Cco do
    its(:label) { is_expected.to eq "CCO" }
  end

  describe License::Ocl do
    its(:label) { is_expected.to eq "OCL" }
  end

  describe License::AllRightsReserved do
    its(:label) { is_expected.to eq "All Rights Reserved" }
  end

  describe License::PublicDomain do
    its(:label) { is_expected.to eq "Public Domain" }
  end
end
