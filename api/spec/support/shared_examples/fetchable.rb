shared_examples_for "a fetcher" do

  it "returns an tempfile pointer" do
    expect(@result[:file]).to be_instance_of Tempfile
  end

  it "includes a non-empty temp file pointer in the response" do
    expect(@result[:file].size > 0).to be true
  end

end
