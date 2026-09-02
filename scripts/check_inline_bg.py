import re

for fname in ['index.html', 'app.js']:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # find inline styles with background or buttons
    matches = re.findall(r'<button[^>]*style=["\']([^"\']*)["\']', content)
    for m in matches:
        print(f"[BUTTON STYLE] {fname}: {m}")
        
    all_styles = re.findall(r'style=["\']([^"\']*background[^"\']*)["\']', content)
    for s in all_styles:
        if any(w in s.lower() for w in ['#fff', 'white', '#f8fafc', '#f1f5f9', '#e2e8f0', 'rgb(255']):
            print(f"[WHITE/LIGHT INLINE BG] {fname}: {s}")
