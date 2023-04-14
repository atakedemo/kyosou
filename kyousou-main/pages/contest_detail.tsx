import { useState } from 'react';
import type { NextPage } from "next";
import { useRouter } from 'next/router';
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
  
  const handleDetail = () => {

  }

  const handleRegister = () => {

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
                onClick={() => routeItemDetail(contest.id)}
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
