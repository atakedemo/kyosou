import React from 'react';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import ReactPlayer from 'react-player';
import { Box, Button, IconButton, Paper, Typography } from '@material-ui/core';
import { Share, ShoppingCart } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3),
    margin: theme.spacing(3),
  },
  image: {
    width: '100%',
    height: 'auto',
    aspectRatio: '1 / 1',
    marginBottom: theme.spacing(2),
  },
  player: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
}));

const Item_Detail: React.FC = () => {
  const router = useRouter();
  const classes = useStyles();

  const handlePlay = () => {
    // 音楽を再生するコード
  };

  const handleBuy = () => {
    // 購入処理を実行するコード
  };

  const handleShare = () => {
    // 共有機能を実行するコード
  };

  return (
    
    <Paper className={classes.root}>
      <Typography>作品詳細：{router.query.item_id}</Typography>
      <Box>
        <img
          className={classes.image}
          src="https://dao-organizor.s3.ap-northeast-1.amazonaws.com/assets/kotatsu.png"
          alt="イメージ画像"
        />
      </Box>
      <Box className={classes.player}>
        <ReactPlayer url="/path/to/music.mp3" controls={true} />
      </Box>
      <Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ShoppingCart />}
          onClick={handleBuy}
        >
          作品一覧へ戻る
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ShoppingCart />}
          onClick={handleBuy}
        >
          投票する
        </Button>
        <IconButton onClick={handleShare}>
          <Share />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default Item_Detail;
