"use client";
import styles from './css/editor.module.scss';
import { saveAs } from 'file-saver';
import { useRef, useState } from 'react';
import { asBlob } from 'html-docx-js-typescript'
import { StylingBar } from '../components/stylingbar/stylingbar';
import {junk} from './text';
export default function Test() {
  const pageContentRef = useRef<HTMLDivElement>(null);
  const [currentFontSize, setCurrentFontsize] = useState<string | null>('15pt');


  const downloadDoc = async () => {
    try {
      const anchors = document.querySelectorAll('.anchor');

      anchors.forEach((anchor) => {
        anchor.style.display = 'none';
      });
      const content =(pageContentRef.current)!.innerHTML;
      const docxBlob = await asBlob(content);
      saveAs(docxBlob as Blob, 'page-content.docx');

      anchors.forEach((anchor) => {
        anchor.style.display = 'inline';
      });
    } catch (error) {
      console.error("Error generating docx:", error);
    }
  };

  const editorGeneralStyles: React.CSSProperties = {
    fontSize: "15pt", 
    fontFamily: 'Arial',
    width: "468pt",
    textAlign: "justify",
    minHeight:"540pt",
    //outline:'none'
  };


  const handleFontSizeinSelection = (e: React.MouseEvent) => {
    const selection = window.getSelection();
    const fontsFound: string[] = [];
    
    const convertPxToPt = (fontSizePx: string): string => {
      const numericFontSizePx = parseFloat(fontSizePx);
      const fontSizePt = Math.round(numericFontSizePx * (72 / 96));
      return `${fontSizePt}pt`;
    };
  
    if (!selection || selection.rangeCount === 0 || selection.getRangeAt(0).toString().length < 1) {
      const fontSizeAtTarget = window.getComputedStyle(e.target as Element).fontSize;
      setCurrentFontsize(convertPxToPt(fontSizeAtTarget));
      return;
    } else {
      const range = selection.getRangeAt(0);
      range.cloneContents().childNodes.forEach(function processNode(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const existingFontSize = (node as HTMLElement).style.fontSize || window.getComputedStyle((node as HTMLElement)).fontSize;
          if (existingFontSize) {
            fontsFound.push(convertPxToPt(existingFontSize));
          } else {
            fontsFound.push(convertPxToPt(currentFontSize as string));
          }
          node.childNodes.forEach(processNode);
        } else {
          const parentElement = (node).parentElement || (node).parentNode!.parentElement || range.startContainer.parentElement;
          const computedFontSize = window.getComputedStyle(parentElement!).fontSize;
          fontsFound.push(convertPxToPt(computedFontSize));
        }
      });
    }
  
    const equalSizes = fontsFound.length === 0 || fontsFound.filter((f) => f !== '').every((size) => size === fontsFound[0]);
  
    if (equalSizes) {
      setCurrentFontsize(fontsFound.find((f) => f !== '')!);
    } else {
      setCurrentFontsize(null);
    }
  };
  

  const removeEdges = () => {
    document.getElementById('start')?.remove();
    document.getElementById('end')?.remove();
  };

  return (
    <div className={styles.box}>
      <div className={styles.box_shell}>
        <div className={styles.box_shell_editor}>
          <StylingBar 
            currentFontSize = {currentFontSize}
            setCurrentFontsize = {setCurrentFontsize}
            download={downloadDoc}
          />
          <div id='visualiser' style={{border:'2pt solid orange', height: '200px', display:'none'}}></div> 
          <div id={styles.content} ref={pageContentRef} >
              {
                [...Array(8)].map((e,i)=>
                  <span className='anchor' id={styles.anchor} style={{ top: i * 548 - ( i === 0 ? 11 : 0 ) + 'pt' }} key={i}>-----------------</span>
                )
              }
              <div 
                contentEditable 
                id="test"
                style={editorGeneralStyles}
                onMouseUp={handleFontSizeinSelection}
                onMouseDown={removeEdges}
              >
                {junk}
            

{/*                   <b>kaegajeg</b>
                    <i>some italic rome <u>underlined in it</u> text</i> lol 
                    <u> some more underlined</u>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.                     
                    Quos assumenda vitae cupiditate  maxime accusantium eius ducimus architecto excepturi ab, hic provident.
                    <i>some em <u>very underline <b>bold inside underlined</b>  element</u> </i>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.  */}
              </div>
          </div>
          <div id='converter'>
          </div>
        </div>
      </div>
    </div>
  );
}