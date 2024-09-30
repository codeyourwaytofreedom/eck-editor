import styles from './css/stylingbar.module.scss';

//import { TOGGLE_STYLE } from '../../editor/utils/textStyling';

export const StylingBar = () => {
  const  TOGGLE_STYLE = (tag:string) => {
    const container = document.getElementById('test');
    const visualiser = document.getElementById('visualiser');

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
    visualiser?.appendChild(wedge);

    visualiser?.appendChild(endRange.cloneContents());
    endRange.deleteContents();

    const selectionWithStyles = container?.innerHTML;
  
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = selectionWithStyles!;
  
    const pureContent = selectionWithStyles!.replace(new RegExp(`<\/?${tag}>`, 'g'), '');
      
    const underlineElements = tempDiv.getElementsByTagName(tag);
    while (underlineElements.length > 0) {
        underlineElements[0].remove();
    }
    const textToUnderline = tempDiv.innerText || tempDiv.textContent;
    if(textToUnderline!.length > 0){
      const start = document.createElement('span');
      start.setAttribute('id', 'start');
      const end = document.createElement('span');
      end.setAttribute('id', 'end');

      const newContent = `<${tag}>` + pureContent + `</${tag}>`;
      // Insert leftSpan before the middle element
      wedge.insertAdjacentElement('beforebegin', start);

      // Insert rightSpan after the middle element
      wedge.insertAdjacentElement('afterend', end);
      wedge.outerHTML = newContent;
      container!.innerHTML = visualiser!.innerHTML;
      visualiser!.innerHTML = '';
      setTimeout(() => {
        const startElement = document.getElementById('start');
        const endElement = document.getElementById('end');
  
        const newrange = document.createRange();
  
        newrange.setStartAfter(startElement!);
        newrange.setEndBefore(endElement!);
        
        selection!.removeAllRanges();
        selection!.addRange(newrange); 
      }, 2000);
      //alert('ADD');
    }
    // remove underline
    else{
      wedge.outerHTML = '<span id="start"></span>' + pureContent + '<span id="end"></span>';
      container!.innerHTML = visualiser!.innerHTML;
      visualiser!.innerHTML = '';
      setTimeout(() => {
        const startElement = document.getElementById('start');
        const endElement = document.getElementById('end');
  
        const newrange = document.createRange();
  
        newrange.setStartAfter(startElement!);
        newrange.setEndBefore(endElement!);
        
        selection!.removeAllRanges();
        selection!.addRange(newrange); 
      }, 2000);
      //alert('REMOVE');
    }
  };

  return (
    <div id={styles.controls}>
      <button onClick={() => TOGGLE_STYLE('b')}> <strong>B</strong> </button>
      <button onClick={() => TOGGLE_STYLE('u')}> <u>U</u> </button>
      <button onClick={() => TOGGLE_STYLE('i')}> <em>I</em> </button>
    </div>
  );
};