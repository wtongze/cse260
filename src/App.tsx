import { Canvas, RootState } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { useEffect, useRef, useState } from 'react';
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
  Box,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ModelCard } from './ModelCard';

function App() {
  const drawerWidth = 320;
  const [three, setThree] = useState<RootState>();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
  const [drawer, setDrawer] = useState(isDesktop);
  const topbarRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function resize() {
    if (topbarRef.current && canvasRef.current) {
      const topbar = topbarRef.current;
      const canvas = canvasRef.current;

      if (drawer) {
        const width = isDesktop
          ? window.innerWidth - drawerWidth
          : window.innerWidth;
        const height = window.innerHeight - topbar.clientHeight;

        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        canvas.width = width * 2;
        canvas.height = height * 2;
      }
    }
  }

  useEffect(() => {
    window.addEventListener('resize', resize);
  });

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
              onClick={() => {
                setDrawer(!drawer);
              }}
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
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <List>
          <ModelCard title="Body Model" src="/body.jpg" selected />
          <ModelCard title="SCAPE" src="/scape.png" />
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
        <Toolbar ref={topbarRef} />
        <div id="convas-container" style={{ flexGrow: 1 }}>
          <Canvas
            camera={{ position: [0, 0, 2] }}
            onCreated={setThree}
            style={{ margin: '0 auto' }}
            ref={canvasRef}
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
