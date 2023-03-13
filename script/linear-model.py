import trimesh
import numpy as np
import math
import shutil
import os

model1 = trimesh.load("data/h.0.25.ply")
model2 = trimesh.load("data/h.2.25.ply")

sourceData = [model1.vertices, model2.vertices]
output = []

for vertexIndex in range(12500):
  axisList = []
  for axisIndex in range(3):
    source = list(map(lambda x: x[vertexIndex][axisIndex], sourceData))
    val = source[1] - source[0]
    axisList.append(val)
  output.append(axisList)

try:
  shutil.rmtree('out')
except:
  pass

os.mkdir('out')
for p in range(0, 101, 10):
  delta = np.array(output) * p * 0.01
  base = np.array(sourceData[0])
  final = (base + delta).tolist()
  model3 = trimesh.Trimesh(vertices=final, faces=model2.faces)
  model3.export(f"out/{p}.obj")

  scene = trimesh.Scene()
  scene.add_geometry(model3)
  corners = scene.bounds_corners
  r_e = trimesh.transformations.euler_matrix(
      math.radians(135),
      # math.radians(45),
      math.radians(90),
      math.radians(45),
      "ryxz",
  )
  t_r = scene.camera.look_at(corners['geometry_0'], rotation=r_e)
  scene.camera_transform = t_r
  # scene.show()
  png = scene.save_image()
  with open(f'out/{p}.png', "wb") as f:
    f.write(png)
    f.close()
