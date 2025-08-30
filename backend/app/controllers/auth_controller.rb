class AuthController < ApplicationController
  def github
    redirect_to "/auth/github", allow_other_host: true
  end

  def callback
    auth = request.env["omniauth.auth"]
    user = User.from_omniauth(auth)

    if user.persisted?
      user.update_login_info(
        ip: request.remote_ip,
        user_agent: request.user_agent
      )

      tokens = user.generate_tokens

      redirect_to "#{ENV['NEXT_PUBLIC_BASE_URL']}auth/success?access_token=#{tokens[:access_token]}&refresh_token=#{tokens[:refresh_token]}",
                  allow_other_host: true
    else
      redirect_to "#{ENV['NEXT_PUBLIC_BASE_URL']}auth/error",
                  allow_other_host: true
    end
  end

  def refresh
    refresh_token = params[:refresh_token]

    if refresh_token.blank?
      render json: { error: "Refresh token required" }, status: :bad_request
      return
    end

    token_record = RefreshToken.valid.find_by(token: refresh_token)

    if token_record.nil?
      render json: { error: "Invalid or expired refresh token" }, status: :unauthorized
      return
    end

    user = token_record.user
    new_access_token = JwtService.encode({ user_id: user.id })

    render json: { access_token: new_access_token }
  end

  def logout
    refresh_token = params[:refresh_token]

    if refresh_token.present?
      RefreshToken.find_by(token: refresh_token)&.destroy
    end

    render json: { message: "Logged out successfully" }
  end

  def failure
    redirect_to "#{ENV['NEXT_PUBLIC_BASE_URL']}auth/error",
                allow_other_host: true
  end
end
