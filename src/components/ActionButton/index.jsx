
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

export default ActionButton;