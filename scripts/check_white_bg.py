import re

with open('styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Let's inspect rules with light backgrounds:
rules = re.findall(r'([^{]+)\{([^}]+)\}', css)
for sel, body in rules:
    sel_clean = sel.strip().replace('\n', ' ')
    for prop in body.split(';'):
        prop_clean = prop.strip()
        if 'background' in prop_clean:
            # check if background is light or white
            if any(c in prop_clean.lower() for c in ['#fff', 'white', '#f8fafc', '#f1f5f9', '#e2e8f0', '#ffffff', 'rgba(255, 255, 255, 0.9', 'rgba(255,255,255,0.9']):
                print(f"LIGHT BG: {sel_clean} -> {prop_clean}")
