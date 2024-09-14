import styles from './css/stylingbar.module.scss';

interface StylingBarProps {
    range: Range | null,
    targetElement: HTMLElement | null
}

export const StylingBar:React.FC<StylingBarProps> = ({range, targetElement}) => {
  const targetId = new Date().getTime().toString();
  const changeTextStyle = (
    style: string | number | 'left' | 'right' | 'center' | 'justify'

  ) => {
    const existentTarget = document.getElementById(targetId);
    const replacement = existentTarget || document.createElement('span');
    if( !existentTarget ) {
      const computedStyles = window.getComputedStyle(targetElement!);
      const { fontWeight, fontStyle, textDecoration, fontSize } = computedStyles;
      //transfer existing styling
      replacement.style.fontWeight = fontWeight;
      replacement.style.fontStyle = fontStyle;
      replacement.style.textDecoration = textDecoration;
      replacement.style.fontSize = fontSize;
      replacement.id = targetId;
      range!.surroundContents(replacement);
    }
    const { fontWeight, fontStyle, textDecoration, fontSize } = replacement!.style;
    if( typeof style === 'number' ) {
      const newFontSize = parseInt(fontSize) + style;
      document.getElementById('fontSize')!.innerText = newFontSize + 'px';
      return replacement!.style.fontSize = newFontSize + 'px';
    }
    switch (style) {
      case "bold":
        const newFontWeight = fontWeight === '600' ? '400' : '600';
        return replacement!.style.fontWeight = newFontWeight;
      case "italic":
        const newFontStyle = fontStyle === 'italic' ? 'normal' : 'italic';
        return replacement!.style.fontStyle = newFontStyle;
      case "underline":
        const newTextDecoration =  textDecoration === 'underline' ? 'none' : 'underline';
        return replacement!.style.textDecoration = newTextDecoration;
        case 'left':
        case 'right':
        case 'center':
        case 'justify':
          replacement!.style.textAlign = style;
    }
  };
  
  return (
  <div id={styles.controls}>
    <button onClick={()=>changeTextStyle(-1)}>----</button>
    <strong id='fontSize'>20px</strong>
    <button onClick={()=>changeTextStyle(1)}>++++</button>
    <button onClick={()=>changeTextStyle("bold")}>Bold</button>
    <button onClick={()=>changeTextStyle("italic")}>Italic</button>
    <button onClick={()=>changeTextStyle("underline")}>Underlined</button>
    <button onClick={()=>changeTextStyle("left")}>Left</button>
    <button onClick={()=>changeTextStyle("right")}>Right</button>
    <button onClick={()=>changeTextStyle("center")}>Center</button>
    <button onClick={()=>changeTextStyle("justify")}>Justify</button>
  </div>
  );
}