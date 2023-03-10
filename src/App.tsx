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
  Select,
  MenuItem,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import ModelIcon from '@mui/icons-material/AccessibilityNew';
import DownloadIcon from '@mui/icons-material/Download';
import MenuIcon from '@mui/icons-material/Menu';
import DeltaIcon from '@mui/icons-material/ChangeHistory';
import DatasetIcon from '@mui/icons-material/DataObject';
import { ModelCard } from './ModelCard';

enum Format {
  gltf = 'gltf',
  ply = 'ply',
  obj = 'obj',
}

export enum Model {
  SCAPE,
  BodyModel,
}

const modelData = {
  [Model.BodyModel]: [
    {
      rotation: [-90, 0, 0],
      position: [-0.075, 0, 0],
      base: '/bodymodel/male1.obj',
      target: '/bodymodel/male2.obj',
    },
    {
      rotation: [-90, 0, 0],
      position: [-0.075, 0, 0],
      base: '/bodymodel/female1.obj',
      target: '/bodymodel/female2.obj',
    },
  ],
  [Model.SCAPE]: [
    {
      rotation: [0, -135, 90],
      position: [0.125, -1, 0],
      base: '/scape/mesh000.obj',
      target: '/scape/mesh002.obj',
    },
    {
      rotation: [0, 45, 90],
      position: [0.125, -1, 0],
      base: '/scape/mesh049.obj',
      target: '/scape/mesh050.obj',
    },
    {
      rotation: [0, -45, 90],
      position: [0.125, -0.5, 0],
      base: '/scape/mesh069.obj',
      target: '/scape/mesh070.obj',
    },
  ],
};

function App() {
  const drawerWidth = 320;
  const [three, setThree] = useState<RootState>();
  const [currentDataSet, setCurrentDataSet] = useState(Model.BodyModel);
  const [currentModel, setCurrentModel] = useState(0);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
  const [drawer, setDrawer] = useState(isDesktop);
  const topbarRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sliderVal, setSliderVal] = useState(0);

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

  const downloadModel = (format: Format) => {
    const modelMesh = three?.scene.children[0].children[3]!;

    const fileName = `model.${format}`;
    switch (format) {
      case Format.gltf:
        const gltfExporter = new GLTFExporter();
        gltfExporter.parse(
          modelMesh,
          (gltf) => {
            download(new Blob([JSON.stringify(gltf)]), fileName);
          },
          console.error
        );
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
          <Typography
            variant="h6"
            color="inherit"
            component="div"
            sx={{ flexGrow: 1 }}
          >
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
              <DatasetIcon
                style={{
                  verticalAlign: 'middle',
                  marginRight: 8,
                  marginBottom: 2,
                }}
              />
              Data Set
            </Typography>
            <ModelCard
              title="Body Model"
              src="/body.jpg"
              selected={currentDataSet === Model.BodyModel}
              onClick={() => {
                setCurrentDataSet(Model.BodyModel);
                setCurrentModel(0);
              }}
              href={'https://graphics.soe.ucsc.edu/data/BodyModels/index.html'}
            />
            <ModelCard
              title="SCAPE"
              src="/scape.png"
              selected={currentDataSet === Model.SCAPE}
              onClick={() => {
                setCurrentDataSet(Model.SCAPE);
                setCurrentModel(0);
              }}
              href={
                'https://graphics.soe.ucsc.edu/private/data/SCAPE/index.html'
              }
            />
          </div>
          <div style={{ margin: '16px 0' }}>
            <Typography sx={{ mb: 1 }} fontWeight={500}>
              <ModelIcon
                style={{
                  verticalAlign: 'middle',
                  marginRight: 8,
                  marginBottom: 2,
                }}
              />
              Model
            </Typography>
            <Select
              value={currentModel}
              fullWidth
              color="primary"
              sx={{
                [`& .MuiSelect-select`]: {
                  border: '2px solid #dee2e6',
                  borderRadius: '8px !important',
                },
                [`&:active`]: {
                  borderRadius: '8px !important',
                },
              }}
            >
              {modelData[currentDataSet].map((i, idx) => (
                <MenuItem
                  key={i.base}
                  value={idx}
                  onClick={() => setCurrentModel(idx)}
                >
                  Preset {idx + 1}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div style={{ margin: '16px 0' }}>
            <Typography sx={{ mb: 1 }} fontWeight={500}>
              <DeltaIcon
                style={{
                  verticalAlign: 'middle',
                  marginRight: 8,
                  marginBottom: 2,
                }}
              />
              Delta
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
          <div style={{ margin: '16px 0' }}>
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
            <Human
              delta={sliderVal}
              {...modelData[currentDataSet][currentModel]}
            />
            <OrbitControls />
            <Stats className="stats" />
          </Canvas>
        </div>
      </Box>
    </div>
  );
}

export default App;
