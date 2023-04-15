import { useState } from 'react';
import type { NextPage } from "next";
import { useRouter } from 'next/router';
import { Grid, Card, CardMedia, CardContent, Typography, Button, IconButton, Box } from '@material-ui/core';
import { MusicNote, Info, Share } from '@material-ui/icons';
import AudioPlayer from '../components/auto_player';

type Contest = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

const contests: Contest[] = [
  {
    id: "1",
    name: '作品1',
    price: 1000,
    imageUrl: 'https://dao-organizor.s3.ap-northeast-1.amazonaws.com/assets/kotatsu.png',
  },
  {
    id: "2",
    name: '作品2',
    price: 2000,
    imageUrl: 'https://dao-organizor.s3.ap-northeast-1.amazonaws.com/assets/kotatsu.png',
  },
  {
    id: "3",
    name: '作品3',
    price: 3000,
    imageUrl: 'https://dao-organizor.s3.ap-northeast-1.amazonaws.com/assets/kotatsu.png',
  },
];

const ContestList = () => {
  const router = useRouter();

  const vote = () => {
    console.log('Vote!!!!!!')
  }

  const routeItemDetail = async (id: string) => {
    try {
      router.push(
        { 
            pathname: "item_detail", 
            query: {
                item_id: id,
            } 
        }, "item_detail");
    } catch (error) {
      console.log(error)
    }
  };

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
                      onClick={() => vote}
                      style={{ backgroundColor: '#3f51b5', color: 'white', width:'100%' }}
                    >
                      Vote
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
};

export default ContestList;
