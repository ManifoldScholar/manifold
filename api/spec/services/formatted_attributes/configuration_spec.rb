require "rails_helper"

RSpec.describe FormattedAttributes::Configuration do
  let!(:model) do
    Class.new(ApplicationRecord)
  end

  let!(:other_model) do
    Class.new(ApplicationRecord)
  end

  let!(:configuration) { described_class.new model: model }

  subject { configuration }

  it "can define a formatted attribute" do
    expect do
      configuration.define! :foo
    end.to change(configuration, :size).by(1)
  end

  context "with some definitions" do
    before do
      configuration.define! :other
      configuration.define! :foo, container: :bar
      configuration.define! :foo
    end

    its(:derived_method_names) { are_expected.to have_at_least(3).items }
    its(:keys) { are_expected.to contain_exactly :other, :bar__foo, :foo }
    its(:paths) { are_expected.to contain_exactly "other", "bar.foo", "foo" }

    it "can be cloned" do
      expect do
        configuration.clone_for other_model
      end.to execute_safely
    end
  end

  describe "#fetch" do
    context "with an unknown needle" do
      it "raises an error" do
        expect do
          configuration.fetch "foo"
        end.to raise_error FormattedAttributes::UnknownDefinition
      end
    end

    context "with ambiguous needles" do
      before do
        configuration.define! :other
        configuration.define! :foo, container: :bar
        configuration.define! :foo
      end

      it "raises an error" do
        expect do
          configuration.fetch "foo"
        end.to raise_error FormattedAttributes::AmbiguousNeedle
      end
    end
  end

  describe "#include?" do
    context "with an unknown needle" do
      it "is not found" do
        expect("foo").not_to be_in configuration
      end
    end

    context "with ambiguous needles" do
      before do
        configuration.define! :other
        configuration.define! :foo, container: :bar
        configuration.define! :foo
      end

      it "raises an error" do
        expect do
          configuration.include? "foo"
        end.to raise_error FormattedAttributes::AmbiguousNeedle
      end
    end
  end
end
