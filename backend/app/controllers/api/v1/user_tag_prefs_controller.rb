module Api
  class UserTagPrefsController < ApplicationController
    before_action :authenticate_user!

    # GET /api/v1/user_tag_prefs
    def index
      prefs = current_user.user_tag_prefs.includes(:tag)
      render json: prefs.map { |pref|
        {
          tag: pref.tag.slug,
          weight: pref.weight
        }
      }
    end

    # POST /api/v1/user_tag_prefs
    def create
      tags = params[:tags] # 例: ["python", "ruby", "go"]
      UserTagPref.transaction do
        # 既存のプリファレンスを削除
        current_user.user_tag_prefs.destroy_all
        # 新しいプリファレンスを保存
        tags.each_with_index do |slug, idx|
          tag = Tag.find_by!(slug: slug)
          UserTagPref.create!(
            user: current_user,
            tag: tag,
            weight: 5 - idx # 1番目5, 2番目4, ...
          )
        end
      end
      head :created
    end
  end
end