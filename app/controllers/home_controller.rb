class HomeController < ApplicationController
  def index
    @types = Type.all
    @entry = Entry.new
  end
end
