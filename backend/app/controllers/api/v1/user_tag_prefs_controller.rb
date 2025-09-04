module Api
  module V1
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
        tags = params[:tags]
        unless tags.is_a?(Array) && tags.length.between?(3, 5) && tags.all? { |t| t.is_a?(String) && t.present? }
          render json: { error: "tags must be an array of 3 to 5 non-empty strings" }, status: :bad_request
          return
        end

        found_tags = ::Tag.where(slug: tags).to_a
        if found_tags.size != tags.size
          missing = tags - found_tags.map(&:slug)
          render json: { error: "The following tags do not exist: #{missing.join(', ')}" }, status: :unprocessable_entity
          return
        end

        tag_map = found_tags.index_by(&:slug)
        UserTagPref.transaction do
          # 既存のプリファレンスを削除
          current_user.user_tag_prefs.destroy_all
          # 新しいプリファレンスを保存
          tags.each_with_index do |slug, idx|
            tag = tag_map[slug]
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
end
