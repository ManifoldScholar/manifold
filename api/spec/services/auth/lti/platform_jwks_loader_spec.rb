# frozen_string_literal: true

require "rails_helper"

RSpec.describe Auth::Lti::PlatformJwksLoader do
  let(:registration) { FactoryBot.create(:lti_registration) }
  let(:loader)       { described_class.new(registration) }
  let(:callable)     { loader.to_proc }

  let(:kid)         { "kid-primary" }
  let(:rotated_kid) { "kid-rotated" }

  let!(:first_keypair)  { build_jwks(kid: kid) }
  let!(:second_keypair) { build_jwks(kid: rotated_kid) }

  let(:first_jwks_payload)  { first_keypair[2] }
  let(:second_jwks_payload) { second_keypair[2] }

  before do
    Rails.cache.clear
    stub_request(:get, registration.jwks_uri)
      .to_return(
        { status: 200, body: first_jwks_payload.to_json,
          headers: { "Content-Type" => "application/json" } },
        { status: 200, body: second_jwks_payload.to_json,
          headers: { "Content-Type" => "application/json" } }
      )
  end

  describe "#to_proc" do
    it "returns a lambda that accepts a single options hash" do
      expect(callable).to be_a(Proc)
      expect(callable.lambda?).to be true
      expect(callable.arity).to eq(1)
    end
  end

  describe "cache hit path" do
    it "fetches once and serves subsequent calls from cache" do
      callable.call(kid: kid)
      callable.call(kid: kid)
      callable.call(kid: kid)
      expect(WebMock).to have_requested(:get, registration.jwks_uri).once
    end

    it "returns the JWKS payload hash on the first (uncached) call" do
      result = callable.call(kid: kid)
      expect(result.fetch("keys").first.fetch("kid")).to eq(kid)
    end
  end

  describe "kid-miss invalidation path" do
    it "deletes the cached JWKS, refetches, and writes the new JWKS" do
      # Prime cache with first fetch.
      callable.call(kid: kid)

      # Trigger invalidation — jwt 2.10.2 calls the lambda with invalidate: true.
      result = callable.call(invalidate: true, kid_not_found: true, kid: rotated_kid)

      expect(WebMock).to have_requested(:get, registration.jwks_uri).twice
      expect(result.fetch("keys").first.fetch("kid")).to eq(rotated_kid)
      cached = Rails.cache.read("lti/jwks/#{registration.id}")
      expect(cached.fetch("keys").first.fetch("kid")).to eq(rotated_kid)
    end

    it "emits an INFO log with registration id, kid counts, and duration_ms" do
      callable.call(kid: kid)

      allow(Rails.logger).to receive(:info)
      callable.call(invalidate: true, kid_not_found: true, kid: rotated_kid)

      expect(Rails.logger).to have_received(:info).with(
        a_string_including(
          "LTI JWKS kid-miss refetch:",
          "registration=#{registration.id}",
          "old_kid_count=1",
          "new_kid_count=1",
          "duration_ms="
        )
      )
    end
  end

  describe "debounce" do
    it "raises JWT::DecodeError on a second kid-miss within the debounce window without refetching" do
      callable.call(kid: kid)
      callable.call(invalidate: true, kid_not_found: true, kid: rotated_kid)
      # First miss refetched — debounce key set.

      expect do
        callable.call(invalidate: true, kid_not_found: true, kid: "kid-forged")
      end.to raise_error(JWT::DecodeError, /debounce active/)

      # Still only two fetches (prime + first miss); no third.
      expect(WebMock).to have_requested(:get, registration.jwks_uri).twice
    end

    it "allows a refetch again once the debounce window has elapsed" do
      callable.call(kid: kid)
      callable.call(invalidate: true, kid_not_found: true, kid: rotated_kid)

      Timecop.travel(described_class::DEBOUNCE_TTL + 5.seconds) do
        # Re-stub with a fresh response so the next fetch has something to return.
        stub_request(:get, registration.jwks_uri)
          .to_return(status: 200, body: second_jwks_payload.to_json,
                     headers: { "Content-Type" => "application/json" })

        expect do
          callable.call(invalidate: true, kid_not_found: true, kid: "kid-forged")
        end.not_to raise_error
      end
    end
  end
end
