import { Canvas, RootState } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter';
import { PLYExporter } from 'three/examples/jsm/exporters/PLYExporter';
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
  Slider,
  Button,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import ModelIcon from '@mui/icons-material/AccessibilityNew';
import DownloadIcon from '@mui/icons-material/Download';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import { ModelCard } from './ModelCard';

enum Format {
  glTF = 'gltf',
  ply = 'ply',
  obj = 'obj',
}

export enum Model {
  SCAPE,
  BodyModel,
}

const modelData = {
  [Model.BodyModel]: {
    base: '/SPRING0002.obj',
    target: '/SPRING0001.obj',
  },
  [Model.SCAPE]: {
    base: '/SPRING0002.obj',
    target: '/SPRING0001.obj',
  },
};

function App() {
  const drawerWidth = 320;
  const [three, setThree] = useState<RootState>();
  const [currentModel, setCurrentModel] = useState(Model.BodyModel);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
  const [drawer, setDrawer] = useState(isDesktop);
  const topbarRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sliderVal, setSliderVal] = useState(50);

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

  const downloadModel = async (format: Format) => {
    const modelMesh = three?.scene.children[0].children[3]!;

    const fileName = `model.${format}`;
    switch (format) {
      case Format.glTF:
        const gltfExporter = new GLTFExporter();
        const gltf = await gltfExporter.parseAsync(modelMesh);
        download(new Blob([JSON.stringify(gltf)]), fileName);
        break;
      case Format.obj:
        const objExporter = new OBJExporter();
        const obj = objExporter.parse(modelMesh);
        download(new Blob([obj]), fileName);
        break;
      case Format.ply:
        const plyExporter = new PLYExporter();
        plyExporter.parse(
          modelMesh,
          (ply) => {
            download(new Blob([ply]), fileName);
          },
          {}
        );
        break;
    }
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
        <List
          sx={{
            margin: 2,
            display: 'flex',
            flexFlow: 'column',
            height: '100%',
          }}
        >
          <div>
            <Typography sx={{ mb: 1 }} fontWeight={500}>
              <ModelIcon style={{ verticalAlign: 'middle', marginRight: 8 }} />
              Model
            </Typography>
            <ModelCard
              title="Body Model"
              src="/body.jpg"
              selected={currentModel === Model.BodyModel}
              onClick={() => {
                setCurrentModel(Model.BodyModel);
              }}
            />
            <ModelCard
              title="SCAPE"
              src="/scape.png"
              selected={currentModel === Model.SCAPE}
              onClick={() => {
                setCurrentModel(Model.SCAPE);
              }}
            />
          </div>

          <div style={{ flexGrow: 1, marginTop: 16 }}>
            <Typography sx={{ mb: 1 }} fontWeight={500}>
              <SettingsIcon
                style={{ verticalAlign: 'middle', marginRight: 8 }}
              />
              Weight
            </Typography>
            <div style={{ padding: '0 16px 0' }}>
              <Slider
                value={sliderVal}
                onChange={(e, v) => {
                  setSliderVal(v as number);
                }}
                valueLabelFormat={(e) => `${e}%`}
                valueLabelDisplay="auto"
              />
            </div>
          </div>
          <div>
            <Typography sx={{ mb: 1 }} fontWeight={500}>
              <DownloadIcon
                style={{ verticalAlign: 'middle', marginRight: 8 }}
              />
              Download
            </Typography>
            <Grid2 container>
              <Grid2
                justifyContent="space-between"
                sx={{ display: 'flex', width: '100%' }}
              >
                {Object.keys(Format).map((i) => (
                  <Button
                    key={i}
                    color="inherit"
                    onClick={() => {
                      downloadModel(i as Format);
                    }}
                    sx={{ px: 3 }}
                  >
                    {i}
                  </Button>
                ))}
              </Grid2>
            </Grid2>
          </div>
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
            <Human delta={sliderVal} {...modelData[currentModel]} />
            <OrbitControls />
            <Stats className="stats" />
          </Canvas>
        </div>
      </Box>
    </div>
  );
}

export default App;
