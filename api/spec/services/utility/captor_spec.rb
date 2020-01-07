require "rails_helper"

RSpec.describe Utility::Captor do
  let(:default) { double("The Default Value") }
  let(:one_time) { true }
  let(:captor) { described_class.new default: default, one_time: one_time }

  describe "#capture" do
    context "when one-time" do
      let(:one_time) { true }

      it "returns the stored value" do
        expect do
          @result = captor.capture do |c|
            c << :foo
          end
        end.to execute_safely

        expect(@result).to eq :foo
      end

      it "raises an error when storing more than one value" do
        expect do
          captor.capture do |c|
            c << :foo
            c << :bar
          end
        end.to raise_error Utility::Captor::AlreadyCapturedError
      end

      it "returns the default value when nothing has been stored" do
        expect do
          @result = captor.capture do |c|
            # intentionally left blank
          end
        end.to execute_safely

        expect(@result).to be default
      end
    end

    context "when not one-time" do
      let(:one_time) { false }

      it "returns the last stored value" do
        expect do
          @result = captor.capture do |c|
            c << :foo
            c << :bar
          end
        end.to execute_safely

        expect(@result).to eq :bar
      end
    end
  end

  describe ".capture" do
    it "instantiates and works like #capture" do
      expect do
        @result = described_class.capture do |c|
          c << :foo
        end
      end.to execute_safely

      expect(@result).to eq :foo
    end

    it "takes options" do
      expect do
        @result = described_class.capture(one_time: false) do |c|
          c << :foo
          c << :bar
        end
      end.to execute_safely

      expect(@result).to eq :bar
    end
  end
end
