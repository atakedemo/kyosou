import { useState, useEffect } from "react";
import type { NextPage } from "next";
import Router from 'next/router';
import { ConnectWallet, useNetwork, useAddress, useContract, useContractWrite, Web3Button } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import { Grid, Card, CardMedia, CardContent, Typography, Button, IconButton, Box } from '@material-ui/core';

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

  const routeContestList = async () => {
    try {
      Router.push("contest_list");
    } catch (error) {
      console.log(error)
    }
  };

  const routeMusicRegister = async () => {
    try {
      Router.push("music_register");
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Kyosou "競奏"
        </h1>
        <p></p>
        <div className={styles.connect}>
          <ConnectWallet />
        </div>
        
        <Box style={{ width: '100%', display: 'flex' }}>
          <Card style={{ width: '31%', textAlign: 'center', backgroundColor: '#a09fa6', margin: '10px' }}>
            <CardMedia component="img" image="https://dao-organizor.s3.ap-northeast-1.amazonaws.com/assets/organizor.png" />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Contest Organizer (Coming soon...)
              </Typography>
            </CardContent>
          </Card>
          <Card style={{ width: '31%', textAlign: 'center', margin: '10px' }}>
            <CardMedia component="img" image="https://dao-organizor.s3.ap-northeast-1.amazonaws.com/assets/musician.png" />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                For Musician
              </Typography>
              <Button 
                onClick={routeMusicRegister}
                style={{ backgroundColor: '#3f51b5', color: 'white' }}
              >
                Register Music
              </Button>
            </CardContent>
          </Card>
          <Card style={{ width: '31%', textAlign: 'center', margin: '10px' }}>
            <CardMedia component="img" image="https://dao-organizor.s3.ap-northeast-1.amazonaws.com/assets/audience.png" />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                For Audience
              </Typography>
              <Button 
                onClick={routeContestList}
                style={{ backgroundColor: '#3f51b5', color: 'white' }}
              >
                Play&Vote
              </Button>
            </CardContent>
          </Card>
        </Box>
      </main>
    </div>
  );
};

export default Home;