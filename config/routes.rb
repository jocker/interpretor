Interpretor::Application.routes.draw do
  get "main/index"

  constraints(Routing::SubdomainConstraint) do
    root :to => 'main#index'
    match "js/*path", :to => Routing::JavascriptLoader, :constraints => {:path => /(.+\.js)/}

    resources :channel_join_requests
    resources :messages
    resources :channel_messages

    resources :codes do
      collection do
        post :samples
      end
    end

    resources :code_languages do
      get :list, :compile, :on => :collection
    end

    resources :channels do
      get :available, :subscribed, :pending, :on => :collection
      post :subscribe, :on => :collection
    end

    devise_for :users, :only => :sessions, :controllers => { :sessions => "sessions" } do
      post "sign_in", :to => "sessions#create"
      post "sign_out", :to => "sessions#destroy"
    end

  end


end
