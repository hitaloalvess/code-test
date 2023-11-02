import P from 'prop-types';

import { actionContainer } from './styles.module.css';

const ActionButton = ({ children, onClick }) => {

  return (
    <div
      className={actionContainer}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

ActionButton.propTypes = {
  children: P.element.isRequired,
  onClick: P.func.isRequired
}

export default ActionButton;
