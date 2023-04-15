import type { NextPage } from "next";
import Router from 'next/router';
import { Grid, Card, CardMedia, CardContent, Typography, Button, IconButton, Box } from '@material-ui/core';
import { LibraryMusic } from '@material-ui/icons';
import React from "react";


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

const ContestList = () => {
  const routeContestDetail = async () => {
    try {
      Router.push("contest_detail");
    } catch (error) {
      console.log(error)
    }
  };

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
                  <Button 
                    startIcon={<LibraryMusic />}
                    size="small"
                    onClick={routeContestDetail}
                  >
                    Music List
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
};

export default ContestList;
