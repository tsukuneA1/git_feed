class CreateLanguages < ActiveRecord::Migration[8.0]
  def change
    create_table :languages, id: :uuid do |t|
      t.string  :name,      null: false
      t.string  :slug,      null: false
      t.string  :lang_type, null: false
      t.string  :color
      t.string  :tm_scope
      t.string  :ace_mode
      t.string  :extensions, array: true, default: []
      t.string  :aliases,    array: true, default: []
      t.boolean :popular,    null: false, default: false
      t.timestamps
    end

    add_index :languages, :name, unique: true
    add_index :languages, :slug, unique: true
  end
end
