import { Canvas, RootState } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { useState } from 'react';
import { download } from './Utils';
import { Human } from './Human';
import './App.css';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Box,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function App() {
  const [three, setThree] = useState<RootState>();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
  const [drawer, setDrawer] = useState(isDesktop);

  const downloadModel = () => {
    const modelMesh = three?.scene.children[0].children[3]!;
    const exporter = new GLTFExporter();
    const fileName = 'model.gltf';
    exporter.parse(
      modelMesh,
      (gltf) => {
        const modelFile = new Blob([JSON.stringify(gltf)]);
        download(modelFile, fileName);
      },
      console.error
    );
  };

  return (
    <div className="App" style={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          {isDesktop ? null : (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" color="inherit" component="div">
            CSE 260
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawer}
        onClose={() => {
          setDrawer(false);
        }}
        variant={isDesktop ? 'permanent' : undefined}
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar />
        <div id="convas-container" style={{ flexGrow: 1 }}>
          <Canvas
            camera={{ position: [0, 0, 2] }}
            onCreated={setThree}
            style={{ margin: '0 auto' }}
          >
            <Human />
            <OrbitControls />
            <Stats className="stats" />
          </Canvas>
        </div>
      </Box>
    </div>
  );
}

export default App;
