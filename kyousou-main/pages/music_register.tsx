import type { NextPage } from "next";
import Router from 'next/router';
import React, { useState } from "react";
import axios from 'axios';
import { Button,TextField,Grid,Paper,Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { ChainId, useNetwork, useAddress } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";

interface FormValues {
  name: string;
  category: string;
  description: string;
  image: string;
  contract: string;
}

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
    image: string;
    contract: string;
  }
  
  const MusicRegister: NextPage = () => {
    const address = useAddress();
    const [network, switchNetwork] = useNetwork();
    const [formValues, setFormValues] = useState<FormValues>({
      name: '',
      category: '',
      description: '',
      image: 'https://dao-org.4attraem.com/assets/no_image.jpeg',
      contract: ''
    });
  
    const classes = useStyles();
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [photo, setPhoto] = useState<File | null>(null);
  
    const onImgUpload = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      if (!photo) {
        console.error("写真を選択してください");
        return;
      }
  
      // ファイルをBase64にエンコード
      const reader = new FileReader();
      reader.readAsDataURL(photo);
      reader.onloadend = async () => {
        const base64data = reader.result;
  
        // APIリクエストの送信
        try {
          const response = await axios.post(
            'https://1vlevj4eak.execute-api.ap-northeast-1.amazonaws.com/demo/projects/image', 
            {
              'image_data': JSON.stringify({ photo: base64data })
            }
          );
          console.log(response.data);
          console.log(response.data.body);
          setFormValues((prevValues) => ({
            ...prevValues,
            ['image']: response.data.body,
          }));
        } catch (error) {
          console.error(error);
        }
      };
    };
  
    const routeTop = async () => {
      Router.push("murabito");
    };
  
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
  
      try {
        const response = await axios.post(
          'https://1vlevj4eak.execute-api.ap-northeast-1.amazonaws.com/demo/projects', 
          formValues
        );
        if (response.status === 200) {
          setSubmitted(true);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    };
  
    if (submitted) {
      return (
        <div className={classes.root}>
          <Paper className={classes.paper}>
            <Typography variant="h5">PJが登録されました</Typography>
          </Paper>
          <Button onClick={routeTop}>
            Go To TOP Page
          </Button>
        </div>
      );
    } else {
      return (
        <div className={classes.root}>
          <Paper className={classes.paper}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h4">PJ登録フォーム</Typography>
              </Grid>
              
              <Grid item xs={6}>
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
                    id="contract"
                    name="contract"
                    label="Wallet Address"
                    multiline
                    maxRows={4}
                    variant="standard"
                    value={formValues.contract}
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
              <Grid item xs={6}>
                <form className={classes.form} onSubmit={onImgUpload}>
                  <img src={formValues.image} className={classes.projectImage} />
                  <input
                    id="photo-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                  />
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    className={classes.button}
                  >
                    写真をアップロード
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