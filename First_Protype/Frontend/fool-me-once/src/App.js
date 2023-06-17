import "./App.css";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import Navigation from "./Components/Navigation/Navigation";
import Footer from "./Components/Footer/Footer";

// Pages
import Home from "./Pages/Home";
import Listado from "./Pages/Listado";
import Create from "./Pages/Create";
import Register from "./Pages/Register";
import SingleElectoralPromise from "./Pages/SingleElectoralPromise";

// Carga Smart Contracts
import ElectoralManagerAbi from "../src/contractsData/ElectoralManager.json";
import ElectoralManagerAddress from "../src/contractsData/ElectoralManager-address.json";

function App() {
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [userAccount, setUserAccount] = useState("");
  const [electoralManager, setElectoralManager] = useState({});
  const [isWallet, setWallet] = useState(false); // para controlar si se conecta una wallet
  const [idUser, setIdUser] = useState(0);

  const web3Handler = async () => {
    if (!window.ethereum) {
      setWallet(false);
    }
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setUserAccount(accounts[0].toString());

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    setWallet(true);
    window.ethereum.on("chainChanged", (chainId) => {
      window.location.reload();
    });

    window.ethereum.on("accountsChanged", async function (accounts) {
      setUserAccount(accounts[0]);
      await web3Handler();
    });

    loadContracts(signer);
  };

  const loadContracts = async (signer) => {
    const electoralManager = new ethers.Contract(
      ElectoralManagerAddress.address,
      ElectoralManagerAbi.abi,
      signer
    );
    setElectoralManager(electoralManager);
    console.log(electoralManager);
    console.log(await electoralManager.name());
    const isConnected =
      (await electoralManager.name()) === "FoolMeOnce" ? true : false;
    setConnected(isConnected);
    getUserId(electoralManager);
  };

  const getUserId = async (electoralManager) => {
    let userIdentifier = (
      await electoralManager.checkMyIdentifier()
    ).toNumber();
    console.log(`User identifier: ${userIdentifier}`);
    setIdUser(userIdentifier);
    setLoading(false);

    console.log(userAccount);
    let register = await electoralManager.listPromisers(userAccount);
    console.log("REGISTER2", register);

  };

  useEffect(() => { }, [isWallet, idUser, setIdUser]);

  return (
    <BrowserRouter>
      <div className="App">
        <Navigation
          web3Handler={web3Handler}
          userAccount={userAccount}
          idUser={idUser}
          connected={connected}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/promise"
            element={
              <Listado
                electoralManager={electoralManager}
                userAccount={userAccount}
              />
            }
          />
          <Route
            path="/promise/:tokenId"
            element={
              <SingleElectoralPromise
                electoralManager={electoralManager}
                userAccount={userAccount}
              />
            }
          />
          <Route
            path="/create"
            element={
              <Create
                electoralManager={electoralManager}
                userAccount={userAccount}
              />
            }
          />
          <Route
            path="/register"
            element={
              <Register
                electoralManager={electoralManager}
                setIdUser={setIdUser}
                userAccount={userAccount}
              />
            }
          />
          <Route path="*" element={<Home />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
