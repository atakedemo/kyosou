import React, { useState, useEffect } from "react";
import Router from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Card, CardContent, Typography, Button, Link, Box, Paper } from '@material-ui/core';
import AudioPlayer from '../components/auto_player';
const { Contract, ethers } = require('ethers');
import abiContestJson from "../abi/Contest.json";

type Contest = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

const useStyles = makeStyles((theme) => ({
  root: {
      flexGrow: 1,
      padding: theme.spacing(2),
  },
      paper: {
          padding: theme.spacing(2),
          margin: '50px',
          textAlign: 'center',
          color: theme.palette.text.secondary,
      },
  form: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      '& .MuiTextField-root': {
          margin: theme.spacing(1),
          width: '100%',
      },
  },
  button: {
      marginTop: theme.spacing(1),
      width: '50%',
  },
  projectImage : {
      width: '50%',
  }
}))

const contests: Contest[] = [
  {
    id: "1",
    name: 'Lock Lock Lock',
    price: 1000,
    imageUrl: 'https://dao-organizor.s3.ap-northeast-1.amazonaws.com/assets/kotatsu.png',
  },
  {
    id: "2",
    name: 'Dream!!!!',
    price: 2000,
    imageUrl: 'https://dao-organizor.s3.ap-northeast-1.amazonaws.com/assets/kotatsu.png',
  },
  {
    id: "3",
    name: 'The World',
    price: 3000,
    imageUrl: 'https://dao-organizor.s3.ap-northeast-1.amazonaws.com/assets/kotatsu.png',
  },
];

const ContestList = () => {
  const classes = useStyles();
  const contractAddress="0x9a513e5C611Bf76D5bC8001783Da8Ea2F3456115";
  const contractAbi=abiContestJson.abi;
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hrefProposalId, setProposalId] = useState<string>("");

  const routeTop = async () => {Router.push("murabito");};

  const vote = async () => {
    console.log('Vote!!!!!!')
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const _proposalId = "56849481842933172483649163787603366101907979723037914940441830123039909756530";
    try {
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        provider
      );
      const signer = await provider.getSigner();
      await contract.connect(signer).vote(_proposalId,0,0);
    } catch (error) {
      console.error(error);
    }
  }

  const voteWithPayment = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log('Vote!!!!!!')
    try {
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        provider
      );
      const signer = await provider.getSigner();
      const _proposalId = 0;
      await contract.connect(signer).vote(_proposalId,1000000000000000,0);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new Contract(contractAddress, contractAbi, provider);
    const filter = contract.filters;
    contract.on(filter, (res: any) => {
      console.log(res.transactionHash)
      setProposalId(
        'https://mumbai.polygonscan.com/tx/' + res.transactionHash + '#eventlog');
      setSubmitting(false);
      setSubmitted(true);
    })
  , []})

  if (submitted) {
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Typography variant="h5">Complete Registration!</Typography>
          <Link href={hrefProposalId} variant="body2">Proposal Id</Link>
        </Paper>
        <Button onClick={routeTop}>
          TOP
        </Button>
      </div>
    );
  } else {
    return (
      <>
        <Box p={2} textAlign="center" style={{ padding:'20px' }}>
          <Grid container spacing={2}>
            <Typography gutterBottom variant="h2" component="h2">
              Sample Contest
            </Typography>
          </Grid>
          <Grid container spacing={2}>
            <Typography gutterBottom variant="h5" component="h2">
              2023/04/01~2023/04/31
            </Typography>
          </Grid>
            <Grid container spacing={2}>
            {contests.map((contest) => (
              <Grid item xs={12} sm={6} md={3} key={contest.id}>
                <Card>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {contest.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      Artist : 0xfjaiofashfadsfaos
                    </Typography>
                    
                    <Box style={{ padding:'5px' }}>
                      <AudioPlayer src="https://dao-org.4attraem.com/assets/yume.mp3" />
                    </Box>
                    <Box style={{ padding:'5px', width:'100%' }}>
                      <Button 
                        onClick={vote}
                        style={{ backgroundColor: '#3f51b5', color: 'white', width:'100%' }}
                        disabled={submitting}
                      >
                        {submitting ? 'Voting...' : 'Vote'}
                      </Button>
                    </Box>
                    <Box style={{ padding:'5px', width:'100%' }}>
                      <Button 
                        onClick={voteWithPayment}
                        style={{ backgroundColor: '#3f51b5', color: 'white', width:'100%' }}
                        disabled={submitting}
                      >
                        {submitting ? 'Voting...' : 'Vote with payment'}
                      </Button>
                    </Box>
                  </CardContent>
                  
                </Card>
                
              </Grid>
            ))}
          </Grid>
        </Box>
      </>
    );
  }
};

export default ContestList;
