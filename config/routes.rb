Rails.application.routes.draw do
  root 'home#index'

  devise_for :users, controllers: { omniauth_callbacks: "users/omniauth_callbacks" }

  resources :entries
  resources :profiles, only: [:show]

  namespace :api do
    get '/entries/:id', to: 'entries#show'
    post '/entries', to: 'entries#search'
  end
end
