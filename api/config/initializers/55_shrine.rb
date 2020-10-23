Shrine.storages = Storage::Factory.shrine_storages

Shrine.plugin :mirroring, mirror: { store: :mirror } if Shrine.storages[:mirror]

Shrine.plugin :activerecord
Shrine.plugin :refresh_metadata
Shrine.plugin :signature

Shrine.plugin :upload_options, cache: { move: true }, store: { move: true } if Storage::Factory.store_supports_move?
