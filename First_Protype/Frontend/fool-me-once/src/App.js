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

// utils
import {
  FOOLMEONCE,
  ROUTE_PROMISE,
  ROUTE_PROMISE_TOKEN_ID,
  ROUTE_CREATE,
  ROUTE_REGISTER,
  ROUTE_HOME,
  ROUTE_ABSOLUTE
} from "./utils";

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

    const isConnected =
      (await electoralManager.name()) === FOOLMEONCE ? true : false;
    setConnected(isConnected);
    console.log(isConnected);
    getUserId(electoralManager);
  };

  const getUserId = async (electoralManager) => {
    let userIdentifier = (
      await electoralManager.checkMyIdentifier()
    ).toNumber();
    console.log(`User identifier: ${userIdentifier}`);
    setIdUser(userIdentifier);
    setLoading(false);

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
          <Route path={ROUTE_HOME} element={<Home />} />
          {connected ? (<>
            <Route
              path={ROUTE_PROMISE}
              element={
                <Listado
                  electoralManager={electoralManager}
                  userAccount={userAccount}
                />
              }
            />
            <Route
              path={ROUTE_PROMISE_TOKEN_ID}
              element={
                <SingleElectoralPromise
                  electoralManager={electoralManager}
                  userAccount={userAccount}
                />
              }
            />
            <Route
              path={ROUTE_CREATE}
              element={
                <Create
                  electoralManager={electoralManager}
                  userAccount={userAccount}
                />
              }
            />
            <Route
              path={ROUTE_REGISTER}
              element={
                <Register
                  electoralManager={electoralManager}
                  setIdUser={setIdUser}
                  userAccount={userAccount}
                />
              }
            />

          </>) : (<></>)}

          <Route path={ROUTE_ABSOLUTE} element={<Home />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
