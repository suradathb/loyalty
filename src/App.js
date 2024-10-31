import React from 'react';
import web3Service from './web3.server';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      loyaltyPoints: null,
      kmutnbToken: null,
      addressOwner: '',
    }

  }

 async componentWillMount() {
    await web3Service.loadWeb3()
    await web3Service.loadBlockchainData()
    await web3Service.loadErc20()
    console.log(web3Service.state.loyaltyPoints);
    this.setState({
      account: web3Service.state.account,
      kmutnbToken: web3Service.state.kmutnbToken,
      loyaltyPoints: web3Service.state.loyaltyPoints,
    })
  }

  async AddMint() {
    try {
      // ประมาณค่า gas โดยอัตโนมัติ
      const gasEstimate = await this.state.kmutnbToken.methods
        .addMinter(this.state.addressOwner)
        .estimateGas({ from: this.state.account })

      // ส่งธุรกรรม
      await this.state.kmutnbToken.methods
        .addMinter(this.state.addressOwner)
        .send({
          from: this.state.account,
          gas: gasEstimate, // ใช้ค่า gas ที่ประมาณมา
          gasPrice: '30000000000', // กำหนดค่า gas price (30 gwei)
        })
        .once('receipt', (receipt) => {
          console.log(
            'BurnSuccess',
            this.state.account,
            ':',
            this.state.addressOwner,
          )
          window.location.reload()
        })
    } catch (error) {
      console.error('Transaction Error: ', error)

      // คุณสามารถแจ้งผู้ใช้หรือทำการ retry ธุรกรรมได้ถ้าต้องการ
      alert('เกิดข้อผิดพลาดในการทำธุรกรรม กรุณาลองอีกครั้ง')
    }
  }

  render() {
    return (
      <>
        <form
          role="form"
          onSubmit={(event) => {
            event.preventDefault()
            this.AddMint(this.state)
          }}
        >
          <div className="card">
            <div className="card-header">
              {/* <a
                className="card-link"
                data-toggle="collapse"
                href="#collapsetwo"
              >
                แบบฝึกหัด Smart Contract #2
              </a> */}
            </div>
            <div
              id="collapsetwo"
              className="collapse hide"
              data-parent="#accordion"
            >
              <div class="card-body">
                <div className="row">
                  <div className="col-sm-12 card-col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="account (address)"
                      name="addowner"
                      value={this.state.addressOwner}
                      onChange={(event) => {
                        this.setState({ addressOwner: event.target.value })
                      }}
                    />
                  </div>
                  <div className="col-sm-12 card-col">
                    <input
                      type="submit"
                      value="AddOwner"
                      className="btn btn-success"
                    />
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </>
    );
  }
}


export default App;