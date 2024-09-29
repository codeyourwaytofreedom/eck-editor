import styles from './css/stylingbar.module.scss';

import { TOGGLE_STYLE } from '../../editor/utils/textStyling';

export const StylingBar = () => {

  return (
    <div id={styles.controls}>
      <button onClick={() => TOGGLE_STYLE('b')}> <strong>B</strong> </button>
      <button onClick={() => TOGGLE_STYLE('u')}> <u>U</u> </button>
      <button onClick={() => TOGGLE_STYLE('i')}> <em>I</em> </button>
    </div>
  );
};