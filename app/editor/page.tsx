"use client";
import styles from './css/editor.module.scss';
import { saveAs } from 'file-saver'; // To save files on client-side
import { useEffect, useRef } from 'react';
import { asBlob } from 'html-docx-js-typescript'
import { StylingBar } from '../components/stylingbar/stylingbar';
export default function Test() {
  const pageContentRef = useRef<HTMLDivElement>(null);

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
    fontFamily: 'Georgia',
    width: "625px",
    minHeight: "735px",
    textAlign: "justify",
    outline: 'none'
  };

  useEffect(() => {
    const checkSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const selectedText = selection.toString();
        if (selectedText.length === 0) {
          document.getElementById('start')?.remove();
          document.getElementById('end')?.remove();
        }
      }
    };

    document.addEventListener('selectionchange', checkSelection);

    return () => {
      document.removeEventListener('selectionchange', checkSelection);
    };
  }, []);

  return (
    <div className={styles.box}>
      <div className={styles.box_shell}>
        <div className={styles.box_shell_editor}>
          <StylingBar 
          />
          <button onClick={downloadDoc}>DOWNLOAD</button>
          <div id='visualiser' style={{border:'2px solid orange', height: '200px'}}></div> 
          <div id={styles.content} ref={pageContentRef}>
              <div 
                contentEditable 
                id="test"
                style={editorGeneralStyles}
              >
                  <b>kaegajeg</b>
                    <i>some italic rome <u>underlined in it</u> text</i> lol 
                    <u> some more underlined</u>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos assumenda vitae cupiditate  maxime accusantium eius ducimus architecto excepturi ab, hic provident.
                    <i>some em <u>very underline <b>bold inside underlined</b>  element</u> </i>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. 
{/*                     <span id='start'></span>
                    <b>Sapiente, deserunt molestias perferendis porro vitae sint voluptas</b>
                    <span id='end'></span> */}
              </div>
          </div>
          <div id='converter'>

          </div>
        </div>
      </div>
    </div>
  );
}