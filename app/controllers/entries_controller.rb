class EntriesController < ApplicationController
  def index
    entries = Entry.eager_load(:type).all

    render json: {entries: entries}
  end

  def new
    @entry = Entry.new
  end

  def create
    @entry = Entry.new(entry_params)
    @entry.assign_latlon
    @entry.save

    render json: {status: 'ok'}
  end

  def show
    entry = Entry.find(params[:id])

    render json: {entry: entry}
  end

  def edit
  end

  def update
  end

  def destroy
    Entry.find(params[:id]).destroy
  end

private

  def entry_params
    params.require(:entry).permit!
  end
end
