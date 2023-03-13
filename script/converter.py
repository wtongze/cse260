import trimesh
import os
import shutil

files = os.listdir('scapecomp/')
out = 'out'
picture = 'pic'

shutil.rmtree(out, ignore_errors=True)
shutil.rmtree(picture, ignore_errors=True)
os.mkdir(out)
os.mkdir(picture)

for f in files:
  model = trimesh.load(f'scapecomp/{f}')
  model.export(f"{out}/{f[:-4]}.obj")
  scene = trimesh.Scene()
  scene.add_geometry(model)
  png = scene.save_image()
  with open(f"pic/{f[:-4]}.png", 'wb') as pic:
    pic.write(png)
