import re
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

with open('styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('app.js', 'r', encoding='utf-8') as f:
    js = f.read()

html_buttons = re.findall(r'<button[^>]*class=["\']([^"\']+)["\']', html)
js_buttons = re.findall(r'<button[^>]*class=["\']([^"\']+)["\']', js)

all_classes = set()
for b in html_buttons + js_buttons:
    for cls in b.split():
        all_classes.add(cls)

print("ALL BUTTON CLASSES:")
for cls in sorted(all_classes):
    found = f".{cls}" in css or f".{cls} " in css or f".{cls}:" in css or f".{cls}," in css
    if not found:
        print(f"❌ MISSING CSS: .{cls}")
    else:
        print(f"✅ FOUND: .{cls}")

# Also check any generic button tags or inline styles
print("\nBUTTONS WITHOUT CLASS IN HTML:")
no_class = re.findall(r'<button(?![^>]*class=)[^>]*>', html)
print(no_class)

print("\nBUTTONS WITHOUT CLASS IN JS:")
no_class_js = re.findall(r'<button(?![^>]*class=)[^>]*>', js)
print(no_class_js)
