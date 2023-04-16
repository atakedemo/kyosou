import type { NextPage } from "next";
import Router from 'next/router';
import { Grid, Card, CardMedia, TextField, Paper, Link, CardContent, Typography, Button, IconButton, Box } from '@material-ui/core';
import { LibraryMusic } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from "react";
const { Contract, ethers } = require('ethers');
import abiContestJson from "../abi/Contest.json";

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

type Contest = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

const contests: Contest[] = [
  {
    id: "1",
    name: 'Contest 1',
    price: 1000,
    imageUrl: 'https://dao-organizor.s3.ap-northeast-1.amazonaws.com/assets/kotatsu.png',
  },
  {
    id: "2",
    name: 'Contest 2',
    price: 2000,
    imageUrl: 'https://dao-organizor.s3.ap-northeast-1.amazonaws.com/assets/kotatsu.png',
  },
  {
    id: "3",
    name: 'Contest 3',
    price: 3000,
    imageUrl: 'https://dao-organizor.s3.ap-northeast-1.amazonaws.com/assets/kotatsu.png',
  },
];

const StakingList = () => {
    const classes = useStyles();
    const contractAddress="0xF04E12B81C80915B1Cb0CAEb00f80C990Ab8C474";
    const contractAbi=abiContestJson.abi;
    
    const [formValues, setFormValues] = useState("0")
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [hrefProposalId, setProposalId] = useState<string>("");

    useEffect(() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new Contract(contractAddress, contractAbi, provider);
        const filter = contract.filters;
        contract.on(filter, (res:any, proposalId:String) => {
          console.log(res.transactionHash)
          setProposalId(
            'https://mumbai.polygonscan.com/tx/' + res.transactionHash + '#eventlog');
          setSubmitting(false);
          setSubmitted(true);
        })
    , []})

    const staking = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = await provider.getSigner();
            try {
            const contract = new ethers.Contract(
                contractAddress,
                contractAbi,
                signer
            );
            
            await contract.stakeReward({
                value: ethers.utils.parseEther(formValues),
                gasLimit: 100000,
            });
            } catch (error) {
            console.error(error);
            }
        } catch (error) {
            console.log(error)
        }
    };

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        const { value } = event.target;
        setFormValues(value);
      };

    if (submitted) {
        <div className={classes.root}>
            <Paper className={classes.paper}>
            <Typography variant="h5">Complete Registration!</Typography>
            <Link href={hrefProposalId} variant="body2">Proposal Id</Link>
            </Paper>
        </div>
    } else {
        return (
        <>
            <Box p={2} textAlign="center">
            <Grid container spacing={2}>
            <Typography gutterBottom variant="h2" component="h2">
                Contest List
            </Typography>
            </Grid>
            <Grid container spacing={2}>
            {contests.map((contest) => (
                <Grid item xs={12} sm={6} md={4} key={contest.id}>
                <Card>
                    <Box display="flex">
                        <CardMedia component="img" image={contest.imageUrl} title={contest.name}  style={{ width: '50%' }}/>
                        <CardContent style={{ width: '50%' }}>
                            <Typography gutterBottom variant="h5" component="h2">
                                {contest.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                2023/04/01~2023/04/20
                            </Typography>
                            <form className={classes.form}>
                                <TextField
                                required
                                id="amount"
                                name="amount"
                                label="Amount"
                                value={formValues}
                                onChange={handleInputChange}
                                />
                            </form>
                            <Button 
                                startIcon={<LibraryMusic />}
                                size="small"
                                onClick={staking}
                            >
                                Staking 
                            </Button>
                        </CardContent>
                    </Box>
                </Card>
                </Grid>
            ))}
            </Grid>
            </Box>
        </>
        );
    }
};

export default StakingList;
