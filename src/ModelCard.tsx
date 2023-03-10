import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  ButtonBase,
  IconButton,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

type Props = {
  title: string;
  src: string;
  href: string;
  selected?: boolean;
  onClick?: () => void;
};

export function ModelCard(props: Props) {
  const { selected = false } = props;

  return (
    <ButtonBase
      sx={{ display: 'block', width: '100%', marginBottom: 2 }}
      onClick={props.onClick}
    >
      <Card
        sx={{
          px: 2,
          py: 1,
          border: selected ? '2px solid #1976d2' : '2px solid #dee2e6',
          borderRadius: 2,
        }}
        elevation={selected ? 1 : 0}
      >
        <CardMedia
          sx={{ height: 100, backgroundSize: 'contain' }}
          image={props.src}
          title={props.title}
        />
        <CardContent
          style={{
            padding: '0 8px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography component="div">{props.title}</Typography>
          <IconButton
            href={props.href}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
          >
            <OpenInNewIcon />
          </IconButton>
        </CardContent>
      </Card>
    </ButtonBase>
  );
}
