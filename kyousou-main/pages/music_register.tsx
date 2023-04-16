import type { NextPage } from "next";
import Router from 'next/router';
import React, { useState, useEffect } from "react";
import { Button,TextField,Grid,Paper,Typography, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { ChainId, useNetwork, useAddress } from "@thirdweb-dev/react";
const { utils, Contract, ethers } = require('ethers');
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

interface FormValues {
  name: string;
  category: string;
  description: string;
  url: string;
}
  
const MusicRegister: NextPage = () => {
  const address = useAddress();
  const [network, switchNetwork] = useNetwork();
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    category: '',
    description: '',
    url: ''
  });

  const classes = useStyles();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hrefProposalId, setProposalId] = useState<string>("");

  const routeTop = async () => {Router.push("murabito");};
  const contractAddress="0xF04E12B81C80915B1Cb0CAEb00f80C990Ab8C474";
  const contractAbi=abiContestJson.abi;
  

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

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    try {
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        provider
      );
      const disc = JSON.stringify(formValues);
      console.log(disc)
      const signer = await provider.getSigner();
      await contract.connect(signer).propose(disc);
    } catch (error) {
      console.error(error);
    }
  };

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
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4">Registration Form</Typography>
            </Grid>
            
            <Grid item xs={12}>
              <form className={classes.form} onSubmit={handleSubmit}>
                <TextField
                  required
                  id="name"
                  name="name"
                  label="Name"
                  value={formValues.name}
                  onChange={handleInputChange}
                />
                <TextField
                  required
                  id="description"
                  name="description"
                  label="Description"
                  multiline
                  maxRows={4}
                  variant="standard"
                  value={formValues.description}
                  onChange={handleInputChange}
                />
                <TextField
                  required
                  id="urn"
                  name="url"
                  label="Music File URL (ex. https://example.com/sample.mp3)"
                  multiline
                  maxRows={4}
                  variant="standard"
                  value={formValues.url}
                  onChange={handleInputChange}
                />
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={submitting}
                  className={classes.button}
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </Button>
              </form>
            </Grid>
          </Grid>
        </Paper>
        
      </div>
    );    
  }
};

  export default MusicRegister;