import styles from './css/stylingbar.module.scss';

import { TOGGLE_STYLE, getParentFontSize, replaceTextNodesWithSpan } from '../../editor/utils/textStyling';

interface StylingBarProps {
  currentFontSize: string |  null;
  setCurrentFontsize: React.Dispatch<React.SetStateAction<string | null>>,
  download:()=> void
}

export const StylingBar = ({ currentFontSize, setCurrentFontsize, download }: StylingBarProps) => {
  
const  changeFontSize = (step:number, size?:string) => {
  const container = document.getElementById('test');
  const visualiser = document.getElementById('visualiser');
  visualiser!.innerHTML = '';

  const startElement = document.getElementById('start');
  const endElement = document.getElementById('end');

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.getRangeAt(0).toString().length < 1) {
    return;
  }

  let range;
  if(startElement && endElement){
    range = document.createRange();

    range.setStartAfter(startElement!);
    range.setEndBefore(endElement!);
    
    selection!.removeAllRanges();
    selection!.addRange(range); 
  }else{
    range = selection!.getRangeAt(0);
  }

  const startRange = document.createRange();
  const endRange = document.createRange();
  
  
  startRange.setStartBefore(container!.firstChild!);
  if(startElement && endElement){
    startRange.setEndAfter(startElement);
  }else{
    startRange.setEnd(range.startContainer, Math.min(range.startOffset, (range.startContainer as Text).length));
  }

  if(startElement && endElement){
    endRange.setStartBefore(endElement);
  }else{
    endRange.setStart(range.endContainer, Math.min(range.endOffset, (range.endContainer as Text).length));
  }
  endRange.setEndAfter(container!.lastChild!);

  visualiser!.appendChild(startRange.cloneContents());
  startRange.deleteContents();

  const wedge = document.createElement('span');
  wedge.setAttribute('id','wedge');
  visualiser?.appendChild(wedge);

  visualiser?.appendChild(endRange.cloneContents());
  endRange.deleteContents();
  
  const start = document.getElementById('start') || document.createElement('span');
  start.setAttribute('id', 'start');
  const end = document.getElementById('end') ||  document.createElement('span');
  end.setAttribute('id', 'end');

  wedge!.insertAdjacentElement('beforebegin', start);
  wedge!.insertAdjacentElement('afterend', end);

  
  container!.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const parentElement = node.parentElement;
      if (parentElement && parentElement.tagName === 'SPAN' && parentElement.style.fontSize) {
        const existingFontSize = parseInt(parentElement.style.fontSize.replace('pt', ''));
        parentElement.style.fontSize = size ?? (existingFontSize + step) + 'pt';
        parentElement.style.lineHeight = 1.17 * parseInt(parentElement.style.fontSize.replace('pt', '')) + 'pt';
        parentElement.style.display = 'inline-block';
      } else {
        const existingFontSize = getParentFontSize(node)!;
        const span = document.createElement('span');
        span.style.fontSize = size ?? parseInt(existingFontSize.replace('pt', '')) + step + 'pt';
        span.style.lineHeight = 1.17 * parseInt(span.style.fontSize.replace('pt', '')) + 'pt';
        span.style.display = 'inline-block';
        span.textContent = node.textContent;
        node.replaceWith(span);
      }
    } else {
      replaceTextNodesWithSpan(step, node, size);
    }
  });
  

  visualiser!.innerHTML = visualiser!.innerHTML.replace('<span id="wedge"></span>', container!.innerHTML);
  container!.innerHTML = visualiser!.innerHTML;
  visualiser!.innerHTML = '';

  const newStart = document.getElementById('start');
  const newEnd = document.getElementById('end');

  const newrange = document.createRange();

  newrange.setStartAfter(newStart!);
  newrange.setEndBefore(newEnd!);
  
  selection!.removeAllRanges();
  selection!.addRange(newrange); 
  if(size){
    return;
  }
  if(currentFontSize){
    setCurrentFontsize((parseInt(currentFontSize!.replace('pt','')) + step) + 'pt' );
  }
};

const sizeSelect = (e:React.ChangeEvent<HTMLSelectElement>) => {
  const selectedSize = e.target.value;
  setCurrentFontsize(selectedSize);
  changeFontSize(0,selectedSize);
  const emptySpans = document.querySelectorAll('span:empty');
  emptySpans.forEach((span)=>{
    if(!span.id){
      span.remove();
    }
  })
}

  return (
    <div id={styles.controls}>
      <button className={styles.styler} onClick={() => TOGGLE_STYLE('b')}> <strong>B</strong> <strong className={styles.tooltip}>Bold</strong> </button>
      <button className={styles.styler} onClick={() => TOGGLE_STYLE('u')}> <u>U</u> <u className={styles.tooltip}>Underlined</u> </button>
      <button className={styles.styler} onClick={() => TOGGLE_STYLE('i')}> <em>I</em> <em className={styles.tooltip}>Italic</em>  </button>
      <button className={styles.styler_size} onClick={() => changeFontSize(-1)}>&#8722; <span className={styles.tooltip}>Smaller</span> </button>
      <select onChange={sizeSelect} value={currentFontSize!}>
      {
        [...Array(20)].map((e,i)=>
        <option key={e} value={10+i+'pt'}>{i+10}</option>
        )
      }
      </select> 
      <button className={styles.styler_size} onClick={() => changeFontSize(1)}>+ <span className={styles.tooltip}>Larger</span></button>
      <button id={styles.download} onClick={download}>Download</button>
    </div>
  );
};