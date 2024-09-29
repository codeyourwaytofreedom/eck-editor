export const increaseFontSize = (id:string, by:number) => {
    const element = document.getElementById(id);
    const currentFontSize = window.getComputedStyle(element!).fontSize;
    const newFontSize = parseInt(currentFontSize) + by;    
    element!.style.fontSize = newFontSize + "px";
}

export const  TOGGLE_STYLE = (tag:string) => {
    const container = document.getElementById('test');
    const visualiser = document.getElementById('visualiser');
  
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.getRangeAt(0).toString().length < 1) {
      return;
    }
  
    const range = selection!.getRangeAt(0);
    const startRange = document.createRange();
    const endRange = document.createRange();
    
    startRange.setStartBefore(container!.firstChild!);
    startRange.setEnd(range.startContainer, Math.min(range.startOffset, (range.startContainer as Text).length));
  
    endRange.setStart(range.endContainer, Math.min(range.endOffset, (range.endContainer as Text).length));
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
      const newContent = `<${tag}>` + pureContent + `</${tag}>`;
      wedge.outerHTML = newContent;
      container!.innerHTML = visualiser!.innerHTML;
      visualiser!.innerHTML = '';
      selection?.removeAllRanges();
      //alert('ADD');
    }
    // remove underline
    else{
      wedge.outerHTML = pureContent;
      container!.innerHTML = visualiser!.innerHTML;
      visualiser!.innerHTML = '';
      selection?.removeAllRanges();
      //alert('REMOVE');
    }
    return;
  };