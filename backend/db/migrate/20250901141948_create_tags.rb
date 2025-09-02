class CreateTags < ActiveRecord::Migration[8.0]
  def up
    create_table :tags, if_not_exists: true do |t|
      t.string :slug
      t.string :label

      t.timestamps
    end

    add_index :tags, :slug, unique: true, if_not_exists: true
  end

  def down
    remove_index :tags, :slug if index_exists?(:tags, :slug)
    drop_table :tags, if_exists: true
  end
end
