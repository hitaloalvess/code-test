import { Plus, Minus } from '@phosphor-icons/react';
import P from 'prop-types';

import * as QH from './styles.module.css';
import { useState } from 'react';

const QuestionHeader = ({ title }) => {

  const [active, setActive] = useState(false);

  const handleActive = () => {
    setActive(prev => !prev);
  }

  return (
    <summary
      className={QH.summary}
      onClick={handleActive}
    >
      <p>{title}</p>
      {
        active ?
          <Minus /> :
          <Plus />
      }
    </summary>
  );
};

QuestionHeader.propTypes = {
  title: P.string.isRequired
}

export default QuestionHeader;
