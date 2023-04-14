import { useState } from 'react';
import type { NextPage } from "next";
import Router from 'next/router';
import { Grid, Card, CardMedia, CardContent, Typography, Button, IconButton } from '@material-ui/core';
import { AddShoppingCart, ShoppingCart, Info, Share } from '@material-ui/icons';

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
    imageUrl: 'https://example.com/contest1.jpg',
  },
  {
    id: "2",
    name: 'Contest 2',
    price: 2000,
    imageUrl: 'https://example.com/contest2.jpg',
  },
  {
    id: "3",
    name: 'Contest 3',
    price: 3000,
    imageUrl: 'https://example.com/contest3.jpg',
  },
];

const ContestList = () => {
  const handleDetail = () => {

  }

  const handleRegister = () => {

  }

  const routeContestDetail = async () => {
    try {
      Router.push("contest_detail");
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <Grid container spacing={2}>
      {contests.map((contest) => (
        <Grid item xs={12} sm={6} md={4} key={contest.id}>
          <Card>
            <CardMedia component="img" image={contest.imageUrl} title={contest.name} />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {contest.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {contest.price}円
              </Typography>
              <IconButton
                color="primary"
                aria-label="add to cart"
                onClick={routeContestDetail}
              >
                <ShoppingCart />
              </IconButton>
              <Button href={`/contests/${contest.id}`} startIcon={<Info />} size="small">
                コンテスト詳細
              </Button>
              <IconButton color="primary" aria-label="share">
                <Share />
              </IconButton>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ContestList;
