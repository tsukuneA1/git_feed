class CreateTags < ActiveRecord::Migration[8.0]
  def change
    create_table :tags do |t|
      t.string :slug
      t.string :label

      t.timestamps
    end

    add_index :tags, :slug, unique: true
  end
end
