module Storage
  class << self

    def get_file_sytem(type)

    end

    def add(source_path)
      @backend.add(source_path)
    end

    def remove(storage_path)
      @backend.remove(storage_path)
    end

    def _backend
      @backend ||= new Storage::Backend::FileSystem
    end

  end
end