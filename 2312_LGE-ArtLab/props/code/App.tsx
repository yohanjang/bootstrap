import { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import Address from './components/address';
import Amount from './components/amount';

const App = () => {
  const accounts= ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",  //0
          "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",           //1
          "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",           //2
          "0x90F79bf6EB2c4f870365E785982E1f101E93b906",           //3
          "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",           //4
          "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc"];          //5
  const accountPks= ["0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",  //0
          "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",             //1
          "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",             //2
          "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",             //3
          "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a",             //4
          "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba"];            //5
  const pkMap = new Map<string, string>();
  pkMap.set(accounts[0], accountPks[0]);
  pkMap.set(accounts[1], accountPks[1]);
  pkMap.set(accounts[2], accountPks[2]);
  pkMap.set(accounts[3], accountPks[3]);
  pkMap.set(accounts[4], accountPks[4]);
  pkMap.set(accounts[5], accountPks[5]);
  const getProvider = () => {
    const url= "http://localhost:8545";
    const chainId= 31337;
    const provider = new ethers.JsonRpcProvider(url, chainId);
    return provider;
  }
  const [eth_getBalance_address, setEth_getBalance_address] = useState(accounts[0]);
  const [eth_transfer_address_from, setEth_transfer_address_from] = useState(accounts[0]);
  const [eth_transfer_address_to, setEth_transfer_address_to] = useState(accounts[1]);
  const [eth_transfer_address_to_meta, setEth_transfer_address_to_meta] = useState(accounts[1]);
  const [eth_getBalance_result, setEth_getBalance_result] = useState("0 eth");
  const [eth_transfer_amount, setEth_transfer_amount] = useState("0 eth");
  const [eth_transfer_amount_meta, setEth_transfer_amount_meta] = useState("0 eth");
  const [eth_transfer_result_from, setEth_transfer_result_from] = useState("0 eth");
  const [eth_transfer_result_to, setEth_transfer_result_to] = useState("0 eth");
  const [eth_transfer_result_to_meta, setEth_transfer_result_to_meta] = useState("0 eth");
  const set_address = (flag:string, type:number) => {
    if (type < 0 || type > 4) {
      alert('Not match type!');
    } else {
      if (flag === "eth_getBalance_address") {
        setEth_getBalance_address(accounts[type]);
      } else if (flag === "eth_transfer_address_from") {
        setEth_transfer_address_from(accounts[type]);
      } else if (flag === "eth_transfer_address_to") {
        setEth_transfer_address_to(accounts[type]);
      } else if (flag === "eth_transfer_address_to_meta") {
        setEth_transfer_address_to_meta(accounts[type]);
      }
    }
  }
  const set_amount = (flag:string, amount:number) => {
    if (flag === "eth_transfer_amount") {
      if (amount === 0) {
        setEth_transfer_amount(`${amount} eth`);
      } else {
        const amount_str = eth_transfer_amount;
        let amount_number = Number(amount_str.replace("eth", "").trim());
        let add_amount = amount_number + amount;
        setEth_transfer_amount(`${add_amount} eth`);
      }
    } else if (flag === "eth_transfer_amount_meta") {
      if (amount === 0) {
        setEth_transfer_amount_meta(`${amount} eth`);
      } else {
        const amount_str = eth_transfer_amount_meta;
        let amount_number = Number(amount_str.replace("eth", "").trim());
        let add_amount = amount_number + amount;
        setEth_transfer_amount_meta(`${add_amount} eth`);
      }
    }
  }
  const getEth_transfer_result = async () => {
    console.log(`[${new Date()}][getEth_transfer_result] start ::: from address[${eth_transfer_address_from}]`);
    const bal_from = await getProvider().getBalance(eth_transfer_address_from);
    setEth_transfer_result_from(`${Number(pf_gweiToEther(bal_from))} eth`);
    console.log(`[${new Date()}][getEth_transfer_result] start ::: to address[${eth_transfer_address_to}]`);
    const bal_to = await getProvider().getBalance(eth_transfer_address_to);
    setEth_transfer_result_to(`${Number(pf_gweiToEther(bal_to))} eth`);
  }
  const getEth_getBalance_result = async () => {
    console.log(`[${new Date()}][getEth_getBalance_result] start ::: account[${eth_getBalance_address}]`);
    const bal = await getProvider().getBalance(eth_getBalance_address);
    setEth_getBalance_result(`${Number(pf_gweiToEther(bal))} eth`);
  }
  const eventEth_transfer_result_meta = async () => {
    const connectProvider = new ethers.BrowserProvider(window.ethereum);
    const wallet_transfer_signer = await connectProvider.getSigner();
    if (await wallet_transfer_signer.getAddress() === eth_transfer_address_to_meta) {
      alert('to address must be different from address');
    } else {
      console.log(`[eventEth_transfer_result_meta] start ::: from[${await wallet_transfer_signer.getAddress()}], to[${eth_transfer_address_to_meta}], amount[${eth_transfer_amount_meta}]`);
      const tx_transfer = {
        from: await wallet_transfer_signer.getAddress(),
        to: eth_transfer_address_to_meta,
        value: ethers.parseEther(eth_transfer_amount_meta.replace("eth", "").trim()),
        gas: BigInt(0),
      }
      tx_transfer.gas = await connectProvider.estimateGas(tx_transfer);
      try {
        await wallet_transfer_signer.sendTransaction(tx_transfer).then((result_transfer) => {
          console.dir(result_transfer);
        })
        const bal_to = await getProvider().getBalance(eth_transfer_address_to_meta);
        setEth_transfer_result_to_meta(`${Number(pf_gweiToEther(bal_to))} eth`);
      } catch (error) {
        console.error(`transfer error ::: ${error}`);
        alert("tranfer error");
      }
    }
  }
  const eventEth_transfer_result = async () => {
    if (eth_transfer_address_from === eth_transfer_address_to) {
      alert('to address must be different from address');
    } else {
      console.log(`[${new Date()}][eventEth_transfer_result] start ::: from[${eth_transfer_address_from}], to[${eth_transfer_address_to}], amount[${eth_transfer_amount}]`);
      const wallet_transfer = new ethers.Wallet(String(pkMap.get(eth_transfer_address_from)));
      const wallet_transfer_signer = wallet_transfer.connect(getProvider());
      const tx_transfer = {
        from: eth_transfer_address_from,
        to: eth_transfer_address_to,
        value: ethers.parseEther(eth_transfer_amount.replace("eth", "").trim()),
        gas: BigInt(0),
      }
      tx_transfer.gas = await getProvider().estimateGas(tx_transfer);
      console.dir(tx_transfer);
      try {
        wallet_transfer_signer.sendTransaction(tx_transfer).then((result_transfer) => {
          console.dir(result_transfer);
        })
        getEth_transfer_result();
      } catch (error) {
        console.error(`[${new Date()}]transfer error ::: ${error}`);
        alert("tranfer error");
      }
    }
  }
  function pf_gweiToEther(amount:bigint) {
    const etherAmount = amount/ethers.WeiPerEther;
    const gweiAmount = amount%ethers.WeiPerEther;
    // console.log(`amount ${amount} parse to ether ${etherAmount}.${gweiAmount}`);
    return `${etherAmount}.${gweiAmount}`;
  };
  async function f_test() {
    // console.log(`parseEther ::: ${ethers.parseEther("10")}`)
    // console.log(`parseEther ::: ${ethers.parseEther(eth_transfer_amount.replace("eth", "").trim())}`)
    // console.log(`WeiPerEther ::: ${BigInt(10) * ethers.WeiPerEther}`)
    // console.log(`WeiPerEther ::: ${BigInt(eth_transfer_amount_meta.replace("eth", "").trim()) * ethers.WeiPerEther}`)

    const connectProvider = new ethers.BrowserProvider(window.ethereum);
    const signer = await connectProvider.getSigner();
    // console.dir(`${signer}`);
    // signer.connect(getProvider());
    console.log(`nonce ::: ${await signer.getNonce()}`);
    console.log(`nonce ::: ${await signer.getNonce()}`);
    // console.log(`unlock ::: ${await signer.unlock("1234")}`);
  }
  return (
    <div>
      <h1>Sample contract test page!</h1>
      {/* <button onClick={() => f_test()}>test</button> */}
      <div className='c_boxer'>
        <h2>Ether transactions</h2>
        <div className='c_boxer'>
          <p><b>[balanceOf]</b>
            <button className='c_bule' onClick={()=>getEth_getBalance_result()}>Eth 잔액조회</button>
            <label htmlFor='id_eth_bal_result'>조회 결과 ::: </label><input id='id_eth_bal_result' type="text" value={eth_getBalance_result} />
          </p>
          <p><label htmlFor='id_eth_bal'>조회 address ::: </label><input id='id_eth_bal' type="text" value={eth_getBalance_address} size={45} /></p>
          <p><Address method='eth_getBalance_address' clickEvent={set_address}></Address></p>
        </div>
        <div className='c_boxer'>
          <p><b>[Transfer]</b>
            <button className='c_bule' onClick={()=>eventEth_transfer_result()}>Eth 전송</button>
            <label htmlFor='id_eth_transfer_result_from'>전송 결과(from) ::: </label><input id='id_eth_transfer_result_from' type="text" value={eth_transfer_result_from} />
            <label htmlFor='id_eth_transfer_result_to'>전송 결과(to) ::: </label><input id='id_eth_transfer_result_to' type="text" value={eth_transfer_result_to} />
          </p>
          <p><label htmlFor='id_eth_transfer_address_from'>전송 <b>From</b> address ::: </label><input id='id_eth_transfer_address_from' type="text" value={eth_transfer_address_from} size={45} /></p>
          <p><Address method='eth_transfer_address_from' clickEvent={set_address}></Address></p>
          <p><label htmlFor='id_eth_transfer_address_to'>전송 <b>To</b> address ::: </label><input id='id_eth_transfer_address_to' type="text" value={eth_transfer_address_to} size={45} /></p>
          <p><Address method='eth_transfer_address_to' clickEvent={set_address}></Address></p>
          <p><label htmlFor='id_eth_transfer_amount'>전송 amount ::: </label><input id='id_eth_transfer_amount' type="text" value={eth_transfer_amount} /></p>
          <p><Amount method='eth_transfer_amount' clickEvent={set_amount}></Amount></p>
        </div>
        <div className='c_boxer'>
          <p><b>[Transfer by metamask]</b>
            <button className='c_bule' onClick={()=>eventEth_transfer_result_meta()}>Eth 전송</button>
            <label htmlFor='id_eth_transfer_result_to_meta'>전송 결과(to) ::: </label><input id='id_eth_transfer_result_to_meta' type="text" value={eth_transfer_result_to_meta} />
          </p>
          <p><label htmlFor='id_eth_transfer_address_to_meta'>전송 <b>To</b> address ::: </label><input id='id_eth_transfer_address_to_meta' type="text" value={eth_transfer_address_to_meta} size={45} /></p>
          <p><Address method='eth_transfer_address_to_meta' clickEvent={set_address}></Address></p>
          <p><label htmlFor='id_eth_transfer_amount_meta'>전송 amount ::: </label><input id='id_eth_transfer_amount_meta' type="text" value={eth_transfer_amount_meta} /></p>
          <p><Amount method='eth_transfer_amount_meta' clickEvent={set_amount}></Amount></p>
        </div>
      </div>
    </div>
  )
}

export default App;
