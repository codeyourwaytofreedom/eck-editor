"use client";
import styles from './css/editor.module.scss';
import { saveAs } from 'file-saver'; // To save files on client-side
import { useRef, useState } from 'react';
import { asBlob } from 'html-docx-js-typescript'
import { junk } from './text.js';
import { StylingBar } from '../components/stylingbar/stylingbar';
export default function Test() {
  const pageContentRef = useRef<HTMLDivElement>(null);
  const [documentContent] = useState(junk);
  const [range, setRange] = useState<Range | null>(null);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [isBlockElement, setIsBlockElement] = useState<boolean|undefined>();

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
    const target = window.getComputedStyle(selectionTarget);
    const display = target.display || 'undefined';
    const isBlockElement = !['inline', 'inline-block','inline-flex', 'undefined'].includes(display);
    setIsBlockElement(isBlockElement);
    if(!selection) {
      return;
    } 
    const range = selection.getRangeAt(0);
    if (selectionTarget.contains(range.startContainer) && selectionTarget.contains(range.endContainer)) {
      setRange(range);
      setTargetElement(selectionTarget);
    }
  }

  return (
    <div className={styles.box}>
      <div className={styles.box_shell}>
        <div className={styles.box_shell_editor}>
          <StylingBar 
            range={range}
            targetElement={targetElement}
            isBlockElement={isBlockElement}
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
                  <li>LOL1</li>
                  <li>LOL2</li>
                  { documentContent }
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}