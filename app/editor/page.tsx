"use client";
import styles from './editor.module.scss';
import { saveAs } from 'file-saver'; // To save files on client-side
import { useRef } from 'react';
import { asBlob } from 'html-docx-js-typescript'
import { junk } from './text.js';

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
    textAlign: "justify", 
    fontFamily: 'Georgia',
    width: "625px",
    minHeight: "735px"
  };

  const chageFontSize = (id:string, by:number) => {
    const element = document.getElementById(id);
    const fontSize = document.getElementById("fontSize");

    const currentFontSize = window.getComputedStyle(element!).fontSize;
    const newFontSize = parseInt(currentFontSize) + by;    
    element!.style.fontSize = newFontSize + "px";
    fontSize!.innerText = newFontSize + "px";
  }
  const changeTextStyle = (
    id: string,
    style: string
  ) => {
    const textElement = document.getElementById(id);
    const { fontWeight, fontStyle, textDecoration } = textElement!.style;
    switch (style) {
      case "bold":
        const newFontWeight = fontWeight === '600' ? '400' : '600';
        return textElement!.style.fontWeight = newFontWeight;
      case "italic":
        const newFontStyle = fontStyle === 'italic' ? 'normal' : 'italic';
        return textElement!.style.fontStyle = newFontStyle;
      case "underline":
        const newTextDecoration =  textDecoration === 'underline' ? 'none' : 'underline';
        textElement!.style.textDecoration = newTextDecoration;
      }
  };
  
  

  return (
    <div className={styles.box}>
      <div className={styles.box_shell}>
        <div className={styles.box_shell_editor}>
          <div id={styles.controls}>
          <button onClick={()=>chageFontSize("test", -1)}>----</button>
          <strong id='fontSize'>20px</strong>
          <button onClick={()=>chageFontSize("test", 1)}>++++</button>
          <button onClick={()=>changeTextStyle("test", "bold")}>Bold</button>
          <button onClick={()=>changeTextStyle("test", "italic")}>Italic</button>
          <button onClick={()=>changeTextStyle("test", "underline")}>Underlined</button>
          <button onClick={downloadDoc}>DOWNLOAD</button>
          </div>
          <div id={styles.content} ref={pageContentRef}>
              <div 
                contentEditable 
                id="test"
                style={editorGeneralStyles}
              >
                  { junk }
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}