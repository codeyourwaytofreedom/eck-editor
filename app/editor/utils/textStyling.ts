
export   const  TOGGLE_STYLE = (tag:string) => {
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

  while(document.getElementById('start')){
    document.getElementById('start')?.remove();
  }
  while(document.getElementById('end')){
    document.getElementById('end')?.remove();
  }

  const wedge = document.createElement('span');
  visualiser?.appendChild(wedge);

  visualiser?.appendChild(endRange.cloneContents());
  endRange.deleteContents();

  const selectionWithStyles = container?.innerHTML;

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = selectionWithStyles!;

  let pureContent = selectionWithStyles!.replace(new RegExp(`<\/?${tag}>`, 'g'), '');
  pureContent = pureContent.replace('<span id="start"></span>','');

  const underlineElements = tempDiv.getElementsByTagName(tag);
  while (underlineElements.length > 0) {
      underlineElements[0].remove();
  }
  const textToUnderline = tempDiv.innerText || tempDiv.textContent;
  if(textToUnderline!.length > 0){
    const newContent = `<${tag}>` + pureContent + `</${tag}>`;
    wedge.outerHTML = '<span id="start"></span>' + newContent + '<span id="end"></span>';;
    container!.innerHTML = visualiser!.innerHTML;
    visualiser!.innerHTML = '';
    const startElement = document.getElementById('start');
    const endElement = document.getElementById('end');

    const newrange = document.createRange();

    newrange.setStartAfter(startElement!);
    newrange.setEndBefore(endElement!);
    
    selection!.removeAllRanges();
    selection!.addRange(newrange); 
    //alert('ADD');
  }
  // remove underline
  else{
    wedge.outerHTML = '<span id="start"></span>' + pureContent + '<span id="end"></span>';
    container!.innerHTML = visualiser!.innerHTML;
    visualiser!.innerHTML = '';
    const startElement = document.getElementById('start');
    const endElement = document.getElementById('end');

    const newrange = document.createRange();

    newrange.setStartAfter(startElement!);
    newrange.setEndBefore(endElement!);
    
    selection!.removeAllRanges();
    selection!.addRange(newrange); 
    //alert('REMOVE');
  }
};


export const getParentFontSize = (node: Node): string | null => {
  let parent: Node | null = node.parentNode;

  while (parent) {
    if (parent.nodeType === Node.ELEMENT_NODE) {
      const fontSize = window.getComputedStyle(parent as Element).fontSize;
      if (fontSize && fontSize !== 'inherit') {
        return fontSize;
      }
    }
    parent = parent.parentNode;
  }

  return null;
};



export const replaceTextNodesWithSpan = (step: number, node: Node, size?:string) => {
  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
      const parentElement = child.parentElement;
      if (parentElement && parentElement.tagName === 'SPAN' && parentElement.style.fontSize) {
        const existingFontSize = parseInt(parentElement.style.fontSize.replace('px', ''));
        parentElement.style.fontSize = size ?? (existingFontSize + step) + 'px';
      } else {
        const existingFontSize = getParentFontSize(node) || '16px';
        const span = document.createElement('span');
        span.style.fontSize = size ?? parseInt(existingFontSize.replace('px', '')) + step + 'px';
        span.textContent = child.textContent;
        node.replaceChild(span, child);
      }
    } else {
      replaceTextNodesWithSpan(step,child,size);
    }
  });
}


export   const  keepSelection = () => {
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

  while(document.getElementById('start')){
    document.getElementById('start')?.remove();
  }
  while(document.getElementById('end')){
    document.getElementById('end')?.remove();
  }

  const wedge = document.createElement('span');
  visualiser?.appendChild(wedge);

  visualiser?.appendChild(endRange.cloneContents());
  endRange.deleteContents();

  const selectionWithStyles = container?.innerHTML;

  wedge.outerHTML = '<span id="start"></span>' + selectionWithStyles + '<span id="end"></span>';;
  container!.innerHTML = visualiser!.innerHTML;
  visualiser!.innerHTML = '';
  const start = document.getElementById('start');
  const end = document.getElementById('end');

  const newrange = document.createRange();

  newrange.setStartAfter(start!);
  newrange.setEndBefore(end!);
  
  selection!.removeAllRanges();
  selection!.addRange(newrange); 

};