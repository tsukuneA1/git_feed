# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

User.create!(
  [
    { username: "alice", uid: "u1", name: "Alice" },
    { username: "bob", uid: "u2", name: "Bob" },
    { username: "carol", uid: "u3", name: "Carol" },
    { username: "dave", uid: "u4", name: "Dave" }
  ]
)
