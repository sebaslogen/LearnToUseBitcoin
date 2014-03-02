class WalletsController < ApplicationController
  
  before_action :set_wallet, only: [:show, :edit, :update, :destroy]
  
  def testadd ######################################################## TODO: Test code
    @wallet = Wallet.new( wallet_params )
    if not @wallet.save
      Rails.logger.debug "#{GlobalConstants::DEBUG_MSG}: Error inserting in DB #{@wallet.errors.messages}"
      flash[:error] = "Our monkeys made a mess again and created a magic error inserting wallet into DB"
      redirect_to root_path # halts request cycle
    else
      render action: 'testadd', :layout => false
    end
  end
=begin
  # GET /wallets
  # GET /wallets.json
  def index
    @wallets = Wallet.all
  end

  # GET /wallets/1
  # GET /wallets/1.json
  def show
  end

  # GET /wallets/new
  def new
    @wallet = Wallet.new
  end

  # GET /wallets/1/edit
  def edit
  end

  # POST /wallets
  # POST /wallets.json
  def create
    @wallet = Wallet.new(wallet_params)

    respond_to do |format|
      if @wallet.save
        format.html { redirect_to @wallet, notice: 'Wallet was successfully created.' }
        format.json { render action: 'show', status: :created, location: @wallet }
      else
        format.html { render action: 'new' }
        format.json { render json: @wallet.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /wallets/1
  # PATCH/PUT /wallets/1.json
  def update
    respond_to do |format|
      if @wallet.update(wallet_params)
        format.html { redirect_to @wallet, notice: 'Wallet was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @wallet.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /wallets/1
  # DELETE /wallets/1.json
  def destroy
    @wallet.destroy
    respond_to do |format|
      format.html { redirect_to wallets_url }
      format.json { head :no_content }
    end
  end
=end
  private
=begin
    # Use callbacks to share common setup or constraints between actions.
    def set_wallet
      @wallet = Wallet.find(params[:id])
    end
=end
    # Never trust parameters from the scary internet, only allow the white list through.
    def wallet_params
      params.require(:wallet).permit(:address, :private_key)
    end
end
