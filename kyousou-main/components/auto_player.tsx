import React, { useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AudioPlayerIcon from '@material-ui/icons/PlayArrow';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
});

interface Props {
  src: string;
}

const AudioPlayer: React.FC<Props> = ({ src }) => {
  const classes = useStyles();
  const audioRef = useRef<HTMLAudioElement>(null);

  const play = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  return (
    <div className={classes.root}>
      <audio ref={audioRef} src={src} />
      <Button variant="contained" color="primary" startIcon={<AudioPlayerIcon />} onClick={play}>
        Play
      </Button>
      <Button variant="contained" color="secondary" onClick={pause}>
        Pause
      </Button>
    </div>
  );
};

export default AudioPlayer;
