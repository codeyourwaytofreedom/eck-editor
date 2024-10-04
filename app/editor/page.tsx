"use client";
import styles from './css/editor.module.scss';
import { saveAs } from 'file-saver';
import { useRef, useState } from 'react';
import { asBlob } from 'html-docx-js-typescript'
import { StylingBar } from '../components/stylingbar/stylingbar';

export default function Test() {
  const pageContentRef = useRef<HTMLDivElement>(null);
  const [currentFontSize, setCurrentFontsize] = useState<string | null>('20px');

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
    outline: 'none',
  };


  const handleFontSizeinSelection = (e:React.MouseEvent) => {
    const selection = window.getSelection();
    const fontsFound:string[] = [];
    if (!selection || selection.rangeCount === 0 || selection.getRangeAt(0).toString().length < 1) {
      const fontSizeAtTarget = window.getComputedStyle(e.target as Element).fontSize;
      setCurrentFontsize(fontSizeAtTarget);
      return;
    }
    else{
      const range = selection.getRangeAt(0);
      range.cloneContents().childNodes.forEach(function processNode(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const existingFontSize = (node as HTMLElement).style.fontSize || window.getComputedStyle((node as HTMLElement)).fontSize;
          if (existingFontSize) {
            fontsFound.push(existingFontSize);
          }else{
            fontsFound.push(currentFontSize as string);
          }
          node.childNodes.forEach(processNode);
        }
        else{
          const parentElement = (node).parentElement || (node).parentNode!.parentElement || range.startContainer.parentElement;
          fontsFound.push(window.getComputedStyle(parentElement!).fontSize);
        }
      });
    }
    const equalSizes = fontsFound.length === 0 || fontsFound.filter((f)=> f !== '').every((size)=>size===fontsFound[0]);
    if(equalSizes){
      setCurrentFontsize(fontsFound.find((f)=> f!== '')!);
    }else{
      setCurrentFontsize(null);
    }
  }

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
          <button onClick={downloadDoc}>DOWNLOAD</button>
          <div id='visualiser' style={{border:'2px solid orange', height: '200px'}}></div> 
          <div id={styles.content} ref={pageContentRef}>
              <div 
                contentEditable 
                id="test"
                style={editorGeneralStyles}
                onMouseUp={handleFontSizeinSelection}
                onMouseDown={removeEdges}
              >


                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi veritatis officiis provident repellendus eum dolorum maiores, incidunt molestiae eaque, necessitatibus totam non at quasi et doloribus, sint ratione nemo! Temporibus!


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