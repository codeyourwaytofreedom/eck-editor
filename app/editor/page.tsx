"use client";
import styles from './css/editor.module.scss';
import { saveAs } from 'file-saver'; // To save files on client-side
import { useRef, useState } from 'react';
import { asBlob } from 'html-docx-js-typescript'
import { junk } from './text.js';
import { StylingBar } from '../components/stylingbar/stylingbar';
export default function Test() {
  const pageContentRef = useRef<HTMLDivElement>(null);
  const [documentContent, setDocumentContent] = useState(junk);
  const [range, setRange] = useState<Range | null>(null);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  const downloadDoc = async () => {
    try {
      const content =(pageContentRef.current)!.innerHTML;
      const docxBlob = await asBlob(content);
      saveAs(docxBlob as Blob, 'page-content.docx');
    } catch (error) {
      console.error("Error generating docx:", error);
    }
  };

  const editorGeneralStyles: React.CSSProperties = {
    fontSize: "20px", 
    textAlign: "justify", 
    fontFamily: 'Georgia',
    width: "625px",
    minHeight: "735px"
  };

  const handleSelection = (event: React.MouseEvent<HTMLElement>) => {
    const selectionTarget = event.target as HTMLElement;
    const selection = window.getSelection();
    if(!selection) return;
    const range = selection.getRangeAt(0);
    getFontSizeFromRange(range);
    if (selectionTarget.contains(range.startContainer) && selectionTarget.contains(range.endContainer)) {
      setRange(range);
      setTargetElement(selectionTarget);
    }
  }

  const getFontSizeFromRange = (range: Range): string | null => {
    // Clone the contents of the range to extract nodes
    const fragment = range.cloneContents();
    const nodes = Array.from(fragment.childNodes);
    let fontSize: string | null = null;
    console.log(nodes);

    for (const node of nodes) {
      console.log(node, node.nodeType);
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        const computedStyle = window.getComputedStyle(element);
        const currentFontSize = computedStyle.fontSize;
  
        if (!fontSize) {
          // Set the initial fontSize
          fontSize = currentFontSize;
        } else if (fontSize !== currentFontSize) {
          // Handle cases where font sizes differ
          console.warn('Mixed font sizes in range');
          return null; // Or handle this case as needed
        }
      }
    }
    return fontSize;
  };
  
  

  return (
    <div className={styles.box}>
      <div className={styles.box_shell}>
        <div className={styles.box_shell_editor}>
          <StylingBar 
            range={range}
            targetElement={targetElement}
          />
          <button onClick={downloadDoc}>DOWNLOAD</button>
          <div id={styles.content} ref={pageContentRef}>
              <div 
                contentEditable 
                id="test"
                style={editorGeneralStyles}
                onMouseUp={handleSelection}
              >
                  <h1 id='freedom' style={{border:'2px solid deeppink'}}>Code you Way to Freedom</h1>
                  { documentContent }
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}