import P from 'prop-types';

import * as PL from './styles.module.css';

const ProjectList = ({ children }) => {
  return (
    <ul className={PL.myProjectsList}>
      {children}
    </ul>
  );
};

ProjectList.propTypes = {
  children: P.oneOfType([
    P.element,
    P.arrayOf(P.element),
  ])
}

export default ProjectList;
