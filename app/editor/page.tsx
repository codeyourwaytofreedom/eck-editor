"use client";

import styles from './editor.module.scss';
import { saveAs } from 'file-saver'; // To save files on client-side
import { useRef } from 'react';
import { asBlob } from 'html-docx-js-typescript'

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

    return (
      <div className={styles.box}>
        <div className={styles.box_shell}>
          <div className={styles.box_shell_editor}>
            <div id={styles.controls}>
                <button>One</button>
                <button>Two</button>
                <button onClick={downloadDoc}>DOWNLOAD</button>
            </div>
            <div id={styles.content} ref={pageContentRef}>
                <div contentEditable id={styles.kernel} style={{fontSize: "14px", textAlign: "justify", fontFamily: 'Georgia'}}>
                    hello
                </div>
            </div>
          </div>
        </div>
      </div>
    );
}