class Users::OmniauthCallbacksController < ApplicationController
  def vkontakte
    # You need to implement the method below in your model (e.g. app/models/user.rb)
    @user = User.from_omniauth(request.env["omniauth.auth"])
    @user.save unless @user.persisted?

    sign_in_and_redirect @user
  end

  def failure
    redirect_to root_path
  end
end
