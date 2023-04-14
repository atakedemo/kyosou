import { useState, useEffect } from "react";
import type { NextPage } from "next";
import Router from 'next/router';
import { ConnectWallet, useNetwork, useAddress, useContract, useContractWrite, Web3Button } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import { Button, TextField, Grid, Paper, Typography } from '@material-ui/core';

const Home: NextPage = () => {
  const address = useAddress();

  const [network, switchNetwork] = useNetwork();
  const editionDrop = useContract("0x4F95195A4755a6ddD37E9F002F1a0917B264810E", "edition-drop").contract;
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const sdk = new ThirdwebSDK("mumbai");

  useEffect(() => {
    if (!address) {
      return;
    }
    const checkBalance = async () => {
      try {
        const balance = await editionDrop!.balanceOf(address, 0);
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 this user has a membership NFT!");
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.");
        }
      } catch (error) {
        setHasClaimedNFT(false);
        console.error("Failed to get balance", error);
      }
    };

    // 関数を実行
    checkBalance();
  }, [address, editionDrop]);

  const mintNft = async () => {
    try {
      setIsClaiming(true);
      await editionDrop!.claim("0", 1);
      console.log(
        `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop!.getAddress()}/0`
      );
      setHasClaimedNFT(true);
    } catch (error) {
      setHasClaimedNFT(false);
      console.error("Failed to mint NFT", error);
    } finally {
      setIsClaiming(false);
    }
  };

  const route = async () => {
    try {
      Router.push("contest_list");
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Kyousou (競奏)
        </h1>
        <p></p>
        <div className={styles.connect}>
          <ConnectWallet />
        </div>
        <h1 className={styles.title}>Mint your free 🍪DAO Membership NFT</h1>
        
        <button disabled={isClaiming} onClick={mintNft}>
          {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
        </button>
        <button onClick={route}>
          To Top
        </button>
        
      </main>
    </div>
  );
};

export default Home;