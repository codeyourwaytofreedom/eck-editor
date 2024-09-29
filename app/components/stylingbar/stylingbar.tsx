import { NotFoundBoundary } from 'next/dist/client/components/not-found-boundary';
import styles from './css/stylingbar.module.scss';


const traverseSelection = (selectedContent: Node) => {
  const visualiser = document.getElementById('visualiser');
  Array.from(selectedContent.childNodes).forEach((node)=>{
    if(node.nodeType === Node.TEXT_NODE){
       visualiser?.appendChild(node);
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      if ((node as HTMLElement).tagName === 'U') {
        traverseSelection(node);
      } else {
        const hasUChild = Array.from(node.childNodes).some(childNode => 
          childNode.nodeType === Node.ELEMENT_NODE && (childNode as HTMLElement).tagName === 'U'
        );
        if (hasUChild) {
          traverseSelection(node);
        }
        else{
          visualiser!.appendChild(node);
        }
      }
    }        
  })
  return visualiser!.innerHTML;
};


const clearRangeFromUnderline = (selectedContent: Node): Promise<HTMLElement> => {
  return new Promise((resolve)=>{
    const converterDiv = document.getElementById('converter');
    Array.from(selectedContent.childNodes).forEach((node)=>{
      if(node.nodeType === Node.TEXT_NODE){
        converterDiv?.appendChild(node);
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        if ((node as HTMLElement).tagName === 'U') {
          clearRangeFromUnderline(node);
        } else {
          const hasUChild = Array.from(node.childNodes).some(childNode => 
            childNode.nodeType === Node.ELEMENT_NODE && (childNode as HTMLElement).tagName === 'U'
          );
          if (hasUChild) {
            clearRangeFromUnderline(node);
          }
          else{
            converterDiv!.appendChild(node);
          }
        }
      }        
    })
    resolve(converterDiv!);
  })
};


const check = () => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;
  const visualiser = document.getElementById('visualiser');

  const range = selection.getRangeAt(0);
  if(range.toString().length < 1) return;

  const startContainer = range.startContainer.parentElement;
  const endContainer = range.endContainer.parentElement;

  if(startContainer?.tagName === 'U' && endContainer?.tagName === 'U' ){
    if(startContainer.nextElementSibling === endContainer){
      alert('two U elmeents adjacent');
      return 'all_underlined';
    }
    if(startContainer === endContainer){
      return 'all_underlined'
    }
    alert('43 addditional check needed');
    visualiser!.appendChild(range.cloneContents());
    console.log(visualiser?.innerHTML);
    const anyNotUnderlined = Array.from(visualiser!.childNodes).some((node)=> node.nodeType === Node.TEXT_NODE && node.nodeValue !== '' );
    Array.from(visualiser!.childNodes).forEach((node)=>{
      if(node.nodeType === Node.TEXT_NODE){
        console.log(node);
        console.log(node.parentNode);
      }
    })
    if(anyNotUnderlined){
      alert('51');
      visualiser!.innerHTML = '';
      return 'can_underline';
    }
    alert('55');
    visualiser!.innerHTML = '';
    return 'all_underlined';
  }

  if((range.commonAncestorContainer as HTMLElement).tagName === 'U'){
    //alert('all underlined 222');
    return 'all_underlined';
  }

  if(Array.from(range.cloneContents().childNodes).every((node)=> node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === 'U')){
    //alert('all underlined 333');
    return 'all_underlined';
  }

  if(range.commonAncestorContainer.parentElement?.closest('u')){
    //alert('all underlined 444');
    return 'all_underlined';
  }

  return 'can_underline';
};

const removeU = () => {
  const decision = check();
  if(decision === 'can_underline') {
    alert('cannt execute REMOVE action on this selection ');
    return;
  };
  const visualiser = document.getElementById('visualiser');
  const container = document.getElementById('test');

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;
  
  const startRange = document.createRange();
  const range = selection.getRangeAt(0);
  const cloneRange = range.cloneRange();
  const selectedContent = range.cloneContents();
  const endRange = document.createRange();

  startRange.setStartBefore(container!.firstChild!);
  startRange.setEnd(range.startContainer, Math.min(range.startOffset, (range.startContainer as Text).length));

  endRange.setStart(range.endContainer, Math.min(range.endOffset, (range.endContainer as Text).length));
  endRange.setEndAfter(container!.lastChild!);

  visualiser?.appendChild(startRange.cloneContents());

  startRange.deleteContents();
  clearRangeFromUnderline(selectedContent).then((result)=>{
    while (result.firstChild) {
      visualiser!.appendChild(result.firstChild);
    }
  }).then(()=>{
    range.deleteContents();
  }).then(()=>{
    visualiser?.appendChild(endRange.cloneContents());
    endRange.deleteContents();
  }).then(()=>{
   container!.innerHTML = visualiser!.innerHTML;
   visualiser!.innerHTML = '';
  })
  selection.removeAllRanges();
}

const U_action = () => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const decision = check();
  if(decision === 'all_underlined') {
   alert('must execute REMOVE');
   return;
  }
  alert('can execute UNDERLINE');

  const range = selection.getRangeAt(0);
  const selectedContent = range.cloneContents();
  const startContainer = range.startContainer.parentElement;
  const endContainer = range.endContainer.parentElement;
  const visualiser = document.getElementById('visualiser');

  //inject to start container
  if(startContainer?.tagName === 'U' && endContainer?.tagName !== 'U'){
    alert('can inject to startcontainer');
    const visualiser = document.getElementById('visualiser');
    traverseSelection(selectedContent);
    range.deleteContents();
    startContainer.innerHTML += visualiser?.innerHTML;
    visualiser!.innerHTML = '';
    selection.removeAllRanges();
    return;
  }

  //inject to end container
  if(startContainer?.tagName !== 'U' && endContainer?.tagName === 'U'){
    alert('can inject to endContainer');
    traverseSelection(selectedContent);
    range.deleteContents();
    endContainer.innerHTML = visualiser?.innerHTML + endContainer.innerHTML;
    visualiser!.innerHTML = '';
    selection.removeAllRanges();
    return;
  }


  if(startContainer?.tagName === 'U' && endContainer?.tagName === 'U'){
    alert('start U and end U');
    traverseSelection(selectedContent);
    range.deleteContents();
    const uEl = document.createElement('u');
    uEl.innerHTML = visualiser!.innerHTML;
    range.insertNode(uEl);
    visualiser!.innerHTML = '';
    selection.removeAllRanges();
    return;
  }

  //star and end containers are not U element
  if(startContainer?.tagName !== 'U' && endContainer?.tagName !== 'U'){
    alert("start and end containers are not U so can underline but make suure you transfer U element as text");
    traverseSelection(selectedContent);
    range.deleteContents();
    const u = document.createElement('u');
    u.innerHTML = visualiser!.innerHTML;
    range.insertNode(u);
    visualiser!.innerHTML = '';
    selection.removeAllRanges();
    return;
  }

  alert('last resort')
  traverseSelection(selectedContent);
  range.deleteContents();
  const uEl = document.createElement('u');
  uEl.innerHTML = visualiser!.innerHTML;
  range.insertNode(uEl);
  visualiser!.innerHTML = '';
  selection.removeAllRanges();
  return;
};


const TRAVERSE = () => {
  const container = document.getElementById('test');
  const visualiser = document.getElementById('visualiser');

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;
  
  const range = selection.getRangeAt(0);
  const startRange = document.createRange();
  const endRange = document.createRange();
  
  if (range.startContainer && range.startContainer.nodeType === Node.TEXT_NODE) {
    startRange.setStartBefore(container!.firstChild!);
    startRange.setEnd(range.startContainer, Math.min(range.startOffset, (range.startContainer as Text).length)); // Adjust here
  
    endRange.setStart(range.endContainer, Math.min(range.endOffset, (range.endContainer as Text).length)); // Adjust here
    endRange.setEndAfter(container!.lastChild!);
  }
  
  visualiser?.appendChild(startRange.cloneContents());
  startRange.deleteContents();
  
  const wedge = document.createElement('span');
  wedge.setAttribute('id', 'wedge');
  wedge.innerText = '--------wedge--------';
  visualiser?.appendChild(wedge);
  
  if (endRange.startContainer && endRange.startContainer.nodeType === Node.TEXT_NODE) {
    visualiser?.appendChild(endRange.cloneContents());
    endRange.deleteContents();
  }

  const clean = container?.innerHTML.replace(/<\/?u>/g, '');
  wedge.outerHTML = clean!;
  range.deleteContents();
  container!.innerHTML = '';
  container!.innerHTML = visualiser!.innerHTML;
  visualiser!.innerHTML = '';
  return;
};





export const StylingBar = () => {

  return (
    <div id={styles.controls}>
      <button onClick={() => U_action()}>U action</button>
      <button onClick={() => removeU()}>TEST REMOVE UNDERLINE </button>
      <button onClick={() => TRAVERSE()}>TRAVERSE</button>
    </div>
  );
};