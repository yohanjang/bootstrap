import { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import Address from './components/address';
import Amount from './components/amount';
import coinAbi from './abi/Coin.json';

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
  for (let i=0; i<accounts.length; i++) {
    pkMap.set(accounts[i], accountPks[i]);
  }
  const coinContractAddress="0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const size_address_input=45;
  const getProvider = () => {
    const url= "http://localhost:8545";
    const chainId= 31337;
    const provider = new ethers.JsonRpcProvider(url, chainId);
    return provider;
  }
  const getCoinContract = async (contractAddress?:string) => {
    const connectProvider = new ethers.BrowserProvider(window.ethereum);
    const wallet_coin_signer = await connectProvider.getSigner();
    if (contractAddress) {
      const coinContract = new ethers.Contract(contractAddress, coinAbi.abi, wallet_coin_signer);
      return coinContract;
    }
    const coinContract = new ethers.Contract(coinContractAddress, coinAbi.abi, wallet_coin_signer);
    return coinContract;
  }
  const suffix_eth = "eth";
  const suffix_mona = "mona";
  const zero_eth = "0 "+ suffix_eth;
  const zero_mona = "0 "+ suffix_mona;
  const [eth_getBalance_address, setEth_getBalance_address] = useState(`${accounts[0]}`);
  const [mona_getBalance_address, setMona_getBalance_address] = useState(`${accounts[0]}`);
  const [mona_mint_address, setMona_mint_address] = useState(`${accounts[0]}`);
  const [eth_transfer_address_from, setEth_transfer_address_from] = useState(`${accounts[0]}`);
  const [eth_transfer_address_to, setEth_transfer_address_to] = useState(accounts[1]);
  const [eth_transfer_address_to_meta, setEth_transfer_address_to_meta] = useState(accounts[1]);
  const [eth_getBalance_result, setEth_getBalance_result] = useState(zero_eth);
  const [mona_getBalance_result, setMona_getBalance_result] = useState(zero_mona);
  const [eth_transfer_amount, setEth_transfer_amount] = useState(zero_eth);
  const [mona_mint_amount, setMona_mint_amount] = useState(zero_mona);
  const [eth_transfer_amount_meta, setEth_transfer_amount_meta] = useState(zero_eth);
  const [eth_transfer_result_from, setEth_transfer_result_from] = useState(zero_eth);
  const [eth_transfer_result_to, setEth_transfer_result_to] = useState(zero_eth);
  const [eth_transfer_result_to_meta, setEth_transfer_result_to_meta] = useState(zero_eth);
  const [mona_mint_result, setMona_mint_result] = useState(zero_mona);
  const set_address = (flag:string, type:number) => {
    if (type < 0 || type > 4) {
      alert('Not match type!');
    } else {
      if (flag === "eth_getBalance_address") {
        setEth_getBalance_address(accounts[type]);
      } else if (flag === "mona_getBalance_address") {
        setMona_getBalance_address(accounts[type]);
      } else if (flag === "mona_mint_address") {
        setMona_mint_address(accounts[type]);
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
        setEth_transfer_amount(`${amount} ${suffix_eth}`);
      } else {
        const amount_str = eth_transfer_amount;
        let amount_number = Number(amount_str.replace(suffix_eth, "").trim());
        let add_amount = amount_number + amount;
        setEth_transfer_amount(`${add_amount} ${suffix_eth}`);
      }
    } else if (flag === "eth_transfer_amount_meta") {
      if (amount === 0) {
        setEth_transfer_amount_meta(`${amount} ${suffix_eth}`);
      } else {
        const amount_str = eth_transfer_amount_meta;
        let amount_number = Number(amount_str.replace(suffix_eth, "").trim());
        let add_amount = amount_number + amount;
        setEth_transfer_amount_meta(`${add_amount} ${suffix_eth}`);
      }
    } else if (flag === "mona_mint_amount") {
      if (amount === 0) {
        setMona_mint_amount(`${amount} ${suffix_mona}`);
      } else {
        const amount_str = mona_mint_amount;
        let amount_number = Number(amount_str.replace(suffix_mona, "").trim());
        let add_amount = amount_number + amount;
        setMona_mint_amount(`${add_amount} ${suffix_mona}`);
      }
    }
  }
  const getEth_transfer_result = async () => {
    console.log(`[${new Date()}][getEth_transfer_result] start ::: from address[${eth_transfer_address_from}]`);
    const bal_from = await getProvider().getBalance(eth_transfer_address_from);
    setEth_transfer_result_from(`${Number(pf_gweiToEther(bal_from))} ${suffix_eth}`);
    console.log(`[${new Date()}][getEth_transfer_result] start ::: to address[${eth_transfer_address_to}]`);
    const bal_to = await getProvider().getBalance(eth_transfer_address_to);
    setEth_transfer_result_to(`${Number(pf_gweiToEther(bal_to))} ${suffix_eth}`);
  }
  const getEth_getBalance_result = async () => {
    console.log(`[${new Date()}][getEth_getBalance_result] start ::: account[${eth_getBalance_address}]`);
    const bal = await getProvider().getBalance(eth_getBalance_address);
    setEth_getBalance_result(`${Number(pf_gweiToEther(bal))} ${suffix_eth}`);
  }
  const getMona_getBalance_result = async () => {
    console.log(`[${new Date()}][getMona_getBalance_result] start ::: account[${mona_getBalance_address}]`);
    const coinContract = await getCoinContract();
    const bal = await coinContract.balanceOf(mona_getBalance_address);
    setMona_getBalance_result(`${bal} ${suffix_mona}`);
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
        value: ethers.parseEther(eth_transfer_amount_meta.replace(suffix_eth, "").trim()),
        gas: BigInt(0),
      }
      tx_transfer.gas = await connectProvider.estimateGas(tx_transfer);
      try {
        await wallet_transfer_signer.sendTransaction(tx_transfer).then((result_transfer) => {
          console.dir(result_transfer);
        })
        const bal_to = await getProvider().getBalance(eth_transfer_address_to_meta);
        setEth_transfer_result_to_meta(`${Number(pf_gweiToEther(bal_to))} ${suffix_eth}`);
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
        value: ethers.parseEther(eth_transfer_amount.replace(suffix_eth, "").trim()),
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
  const eventMona_mint_result = async () => {
    if (mona_mint_address === ethers.ZeroAddress) {
      alert('mint address must be not zeroAddress');
    } else {
      console.log(`[${new Date()}][eventMona_mint_result] start ::: to[${mona_mint_address}], amount[${mona_mint_amount}]`);
      const coinContract = await getCoinContract();
      try {
        await coinContract.mint(mona_mint_address, mona_mint_amount.replace(suffix_mona, "").trim()).then((result_mint) => {
          console.dir(result_mint);
          // const resultEvent = coinContract.getEvent(result_mint["hash"]);
          // console.log(`hash[${result_mint["hash"]}, event ::: ${resultEvent}`);
        })
        const coinContract_bal = await getCoinContract();
        const bal = await coinContract_bal.balanceOf(mona_mint_address);
        setMona_mint_result(`${bal} ${suffix_mona}`);
      } catch (error) {
        console.error(`[${new Date()}]mint error ::: ${error}`);
        alert("mint error");
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
      <button onClick={() => f_test()}>test</button>
      <div className='c_boxer'>
        <h2>Ether transactions</h2>
        <div className='c_boxer'>
          <p><b>[balanceOf]</b>
            <button className='c_bule' onClick={()=>getEth_getBalance_result()}>Eth 잔액조회</button>
            <label htmlFor='id_eth_bal_result'>조회 결과 ::: </label><input id='id_eth_bal_result' type="text" value={eth_getBalance_result} />
          </p>
          <p><label htmlFor='id_eth_bal'>조회 address ::: </label><input id='id_eth_bal' type="text" value={eth_getBalance_address} size={size_address_input} /></p>
          <div><Address method='eth_getBalance_address' clickEvent={set_address}></Address></div>
        </div>
        <div className='c_boxer'>
          <p><b>[Transfer]</b>
            <button className='c_bule' onClick={()=>eventEth_transfer_result()}>Eth 전송</button>
            <label htmlFor='id_eth_transfer_result_from'>전송 결과(from) ::: </label><input id='id_eth_transfer_result_from' type="text" value={eth_transfer_result_from} />
            <label htmlFor='id_eth_transfer_result_to'>전송 결과(to) ::: </label><input id='id_eth_transfer_result_to' type="text" value={eth_transfer_result_to} />
          </p>
          <p><label htmlFor='id_eth_transfer_address_from'>전송 <b>From</b> address ::: </label><input id='id_eth_transfer_address_from' type="text" value={eth_transfer_address_from} size={size_address_input} /></p>
          <div><Address method='eth_transfer_address_from' clickEvent={set_address}></Address></div>
          <p><label htmlFor='id_eth_transfer_address_to'>전송 <b>To</b> address ::: </label><input id='id_eth_transfer_address_to' type="text" value={eth_transfer_address_to} size={size_address_input} /></p>
          <div><Address method='eth_transfer_address_to' clickEvent={set_address}></Address></div>
          <p><label htmlFor='id_eth_transfer_amount'>전송 amount ::: </label><input id='id_eth_transfer_amount' type="text" value={eth_transfer_amount} /></p>
          <div><Amount method='eth_transfer_amount' clickEvent={set_amount}></Amount></div>
        </div>
        <div className='c_boxer'>
          <p><b>[Transfer by metamask]</b>
            <button className='c_bule' onClick={()=>eventEth_transfer_result_meta()}>Eth 전송</button>
            <label htmlFor='id_eth_transfer_result_to_meta'>전송 결과(to) ::: </label><input id='id_eth_transfer_result_to_meta' type="text" value={eth_transfer_result_to_meta} />
          </p>
          <p><label htmlFor='id_eth_transfer_address_to_meta'>전송 <b>To</b> address ::: </label><input id='id_eth_transfer_address_to_meta' type="text" value={eth_transfer_address_to_meta} size={size_address_input} /></p>
          <div><Address method='eth_transfer_address_to_meta' clickEvent={set_address}></Address></div>
          <p><label htmlFor='id_eth_transfer_amount_meta'>전송 amount ::: </label><input id='id_eth_transfer_amount_meta' type="text" value={eth_transfer_amount_meta} /></p>
          <div><Amount method='eth_transfer_amount_meta' clickEvent={set_amount}></Amount></div>
        </div>
      </div>
      <br/><br/><br/><br/><br/>
      <div className='c_boxer'>
        <h2>contract transactions</h2>
        <div className='c_boxer'>
          <p><b>[balanceOf]</b>
            <button className='c_bule' onClick={()=>getMona_getBalance_result()}>Mona 잔액조회</button>
            <label htmlFor='id_mona_bal_result'>조회 결과 ::: </label><input id='id_mona_bal_result' type="text" value={mona_getBalance_result} />
          </p>
          <p><label htmlFor='id_mona_bal'>조회 address ::: </label><input id='id_mona_bal' type="text" value={mona_getBalance_address} size={size_address_input} /></p>
          <div><Address method='mona_getBalance_address' clickEvent={set_address}></Address></div>
        </div>
        <div className='c_boxer'>
          <p><b>[mint]</b>
            <button className='c_bule' onClick={()=>eventMona_mint_result()}>Mona 발행</button>
            <label htmlFor='id_mona_mint_result'>발행 결과 ::: </label><input id='id_mona_mint_result' type="text" value={mona_mint_result} />
          </p>
          <p><label htmlFor='id_mona_mint'>발행 address ::: </label><input id='id_mona_mint' type="text" value={mona_mint_address} size={size_address_input} /></p>
          <div><Address method='mona_mint_address' clickEvent={set_address}></Address></div>
          <p><label htmlFor='id_mona_mint_amount'>발행 amount ::: </label><input id='id_mona_mint_amount' type="text" value={mona_mint_amount} /></p>
          <div><Amount method='mona_mint_amount' clickEvent={set_amount} token='mona'></Amount></div>
        </div>
      </div>
    </div>
  )
}

export default App;
