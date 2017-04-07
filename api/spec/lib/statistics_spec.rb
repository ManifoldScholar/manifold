require "rails_helper"

RSpec.describe Statistics do
  let(:instance) { described_class.new }

  shared_context 'a float statistic' do
    let(:attribute_name) { nil }

    before(:each) do
      if attribute_name.nil?
        raise 'Be sure to set attribute_name when including the context'
      end

      write_value 0.0
    end

    def write_value(value)
      instance.__send__(:"#{attribute_name}=", value)
    end

    def expect_setting_to(value)
      expect do
        write_value(value)
      end
    end

    def change_the_value
      change(instance, attribute_name)
    end
  end

  def self.test_float_stat(attribute)
    describe "##{attribute}" do
      include_context 'a float statistic' do
        let(:attribute_name) { attribute }
      end

      it 'can accept a string' do
        expect_setting_to('34').to change_the_value.from(0.0).to(34.0)
      end

      it 'can accept nil' do
        expect_setting_to(nil).not_to change_the_value
      end

      it 'turns ints into floats' do
        expect_setting_to(34).to change_the_value.from(0.0).to(34.0)
      end
    end
  end

  test_float_stat :readers_this_week
  test_float_stat :readers_last_week

  describe '.update!' do
    it 'can be used to update an instance' do
      expect do |b|
        described_class.update!(&b)
      end.to yield_with_args(described_class)
    end
  end

  describe '#update' do
    it 'can be used to update itself' do
      expect do |b|
        instance.update(&b)
      end.to yield_with_args(instance)
    end
  end

  describe '#reader_increase' do
    def expect_reader_increase_with(this_week, last_week)
      instance.readers_this_week = this_week
      instance.readers_last_week = last_week

      expect(instance.reader_increase)
    end

    it 'works with positive increases' do
      expect_reader_increase_with(100, 50).to eq 100
    end

    it 'works with negative increases' do
      expect_reader_increase_with(50, 100).to eq -50
    end

    it 'works with no increase' do
      expect_reader_increase_with(100, 100).to eq 0
    end

    it 'works with missing last week stats' do
      expect_reader_increase_with(50, 0).to eq 5000
    end
  end
end
