class UsersController < ApplicationController
  before_action :validate_id_integer, only: :show

  def index
    users = User.order(created_at: :desc)
    render json: users.as_json(only: visible_fields), status: :ok
  end

  def show
    user = User.find(params[:id])
    render json: user.as_json(only: visible_fields), status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "ユーザーが見つかりません" }, status: :not_found
  end

  private

  def visible_fields
    %i[
      id uid username name avatar_url bio location skills last_login_at role created_at updated_at
    ]
  end

  def validate_id_integer
    return if params[:id].to_s.match?(/\A\d+\z/)
    render json: { error: "不正なIDです" }, status: :bad_request and return
  end
end
