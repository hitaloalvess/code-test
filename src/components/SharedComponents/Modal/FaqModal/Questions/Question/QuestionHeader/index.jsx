import { useState } from 'react';
import P from 'prop-types';
import { CaretDown } from '@phosphor-icons/react';

import * as QH from './styles.module.css';

const QuestionHeader = ({ title }) => {

  const [active, setActive] = useState(false);

  const handleActive = () => {
    setActive(prev => !prev);
  }

  return (
    <summary
      className={`${QH.summary} ${active ? QH.summaryIsActive : ''}`}
      onClick={handleActive}
    >
      <p>{title}</p>
      <CaretDown />
    </summary>
  );
};

QuestionHeader.propTypes = {
  title: P.string.isRequired
}

export default QuestionHeader;
