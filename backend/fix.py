import re
with open('D:/Shelf life/backend/main.py', 'r') as f: content = f.read()
pattern = r'''      try:\n          headers = {'User-Agent': 'Mozilla/5.0'}\n          response = requests.get(fruitImages[req.fruit_name], headers=headers, stream=True)\n          response.raise_for_status()\n          base = Image.open(response.raw).convert(\
RGBA\)\n      except Exception as e:\n          print(f\Failed
to
fetch
req.fruit_name
:
e
\)\n          return {\image\: None}\n          \n      width, height = base.size'''
replacement = '''      try:\n          headers = {'User-Agent': 'Mozilla/5.0'}\n          response = requests.get(fruitImages[req.fruit_name], headers=headers, stream=True)\n          response.raise_for_status()\n          base = Image.open(response.raw).convert(\
RGBA\)\n      except Exception as e:\n          print(f\Failed
to
fetch
req.fruit_name
:
e
\)\n          return {\image\: None}\n          \n      # Pad base to exactly 4:3 aspect ratio (white) to match frontend object-contain bounding box\n      orig_w, orig_h = base.size\n      target_ratio = 4.0 / 3.0\n      orig_ratio = orig_w / orig_h\n      \n      if orig_ratio > target_ratio:\n          new_w = orig_w\n          new_h = int(orig_w / target_ratio)\n      else:\n          new_h = orig_h\n          new_w = int(orig_h * target_ratio)\n          \n      new_base = Image.new(\RGBA\, (new_w, new_h), (255, 255, 255, 255))\n      new_base.paste(base, ((new_w - orig_w) // 2, (new_h - orig_h) // 2))\n      base = new_base\n      \n      width, height = base.size'''
content = content.replace(pattern.replace(r'\n', '\n'), replacement.replace(r'\n', '\n'))
with open('D:/Shelf life/backend/main.py', 'w') as f: f.write(content)
print('Done!')
