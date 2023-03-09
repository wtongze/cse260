import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import { PropsWithoutRef } from 'react';

type Props = PropsWithoutRef<{
  title: string;
  src: string;
  selected?: boolean;
}>;

export function ModelCard(props: Props) {
  const { selected = false } = props;

  return (
    <Card
      sx={{
        padding: 2,
        margin: 2,
        border: selected ? '2px solid #868e96' : '2px solid #dee2e6',
        borderRadius: 2,
      }}
      elevation={0}
    >
      <CardMedia
        sx={{ height: 100, backgroundSize: 'contain' }}
        image={props.src}
        title={props.title}
      />
      <CardContent style={{ padding: '8px 8px 0' }}>
        <Typography variant="h6" component="div">
          {props.title}
        </Typography>
      </CardContent>
    </Card>
  );
}
