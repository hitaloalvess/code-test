import P from 'prop-types';

import * as S from '../styles.module.css';

const RootSection = ({ children }) => {
  return (
    <div className={S.listSections}>
      {children}
    </div>
  );
};

RootSection.propTypes = {
  children: P.oneOfType([
    P.element,
    P.arrayOf(P.element),
    P.object
  ])
}

export default RootSection;
