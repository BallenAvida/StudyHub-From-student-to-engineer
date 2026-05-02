import zipfile
import xml.etree.ElementTree as ET
import glob
import os
import re

def extract_text_from_xml(xml_content):
    try:
        root = ET.fromstring(xml_content)
    except:
        return ''
    texts = []
    for elem in root.iter():
        tag = elem.tag.split('}')[-1] if '}' in elem.tag else elem.tag
        if tag in ['t', 'text']:
            if elem.text:
                texts.append(elem.text)
    
    if not texts:
        full_text = " ".join(root.itertext()).strip()
        if full_text: texts.append(full_text)
        
    return " ".join(texts)

def file_num(name):
    base = os.path.basename(name)
    nums = re.findall(r'\d+', base)
    return int(nums[0]) if nums else 0

def extract_from_category(z, category_prefix):
    paths = [name for name in z.namelist() if category_prefix in name and name.endswith('.xml')]
    paths.sort(key=file_num)
    content = []
    for path in paths:
        try:
            xml_content = z.read(path)
            text = extract_text_from_xml(xml_content)
            if text.strip():
                content.append(f"--- {os.path.basename(path)} ---\n{text}")
        except Exception as e:
            pass
    return "\n\n".join(content)

def main():
    for pptx in glob.glob('*.pptx'):
        print(f'Extracting: {pptx}')
        try:
            with zipfile.ZipFile(pptx, 'r') as z:
                slides = extract_from_category(z, 'ppt/slides/slide')
                notes = extract_from_category(z, 'ppt/notesSlides/notesSlide')
                comments = extract_from_category(z, 'ppt/comments/')
                
                final_text = f"=== SLIDES ({pptx}) ===\n{slides}\n\n"
                if notes.strip(): final_text += f"=== PRESENTATION NOTES ===\n{notes}\n\n"
                if comments.strip(): final_text += f"=== COMMENTS ===\n{comments}\n\n"
                
                txt_name = pptx.replace('.pptx', '_COMPLETO.txt')
                with open(txt_name, 'w', encoding='utf-8') as f:
                    f.write(final_text)
            print(f'Done: {txt_name}')
        except Exception as e:
            print(f'Error on {pptx}: {e}')

if __name__ == '__main__':
    main()
