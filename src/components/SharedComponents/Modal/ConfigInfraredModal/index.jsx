import P from 'prop-types';

import {
  infraredControl,
  controlMinimizer,
  controlNumbers,
  controlDirectionals,
  controlRow,
  controlRowCenter,
  controlGeneratorCode
} from './styles.module.css';


import { useRef } from 'react';
import InfraredButton from './InfraredButton';


const ConfigInfraredModal = ({ isOpen, closeModal, handleUpdateCode }) => {

  const inputRef = useRef(null);

  const handleButtonClick = (value) => {
    handleUpdateCode(value);
  }

  const handleInputChange = () => {
    if (inputRef.current.value === '')
      handleUpdateCode('FF12F3');
    else
      handleUpdateCode((inputRef.current.value).toUpperCase());
  }

  if (isOpen) {
    return (
      <div className={infraredControl}>
        <button className={controlMinimizer} onClick={closeModal}>-</button>

        <div className={controlNumbers}>
          <div className={controlRow}>
            <InfraredButton color='white' handleButtonClick={handleButtonClick} value='FF12F3' text='1' />
            <InfraredButton color='white' handleButtonClick={handleButtonClick} value='FFD223' text='2' />
            <InfraredButton color='white' handleButtonClick={handleButtonClick} value='DD12F1' text='3' />
          </div>
          <div className={controlRow}>
            <InfraredButton color='white' handleButtonClick={handleButtonClick} value='A212F3' text='4' />
            <InfraredButton color='white' handleButtonClick={handleButtonClick} value='F512D3' text='5' />
            <InfraredButton color='white' handleButtonClick={handleButtonClick} value='FF12DD' text='6' />
          </div>
          <div className={controlRow}>
            <InfraredButton color='white' handleButtonClick={handleButtonClick} value='F1DDA3' text='7' />
            <InfraredButton color='white' handleButtonClick={handleButtonClick} value='AA12DD' text='8' />
            <InfraredButton color='white' handleButtonClick={handleButtonClick} value='C212D9' text='9' />
          </div>
          <div className={controlRow}>
            <InfraredButton color='var(--red)' handleButtonClick={handleButtonClick} value='CCFFDD' text='*' />
            <InfraredButton color='white' handleButtonClick={handleButtonClick} value='F2DC98' text='0' />
            <InfraredButton color='var(--red)' handleButtonClick={handleButtonClick} value='FFFFFF' text='#' />
          </div>
        </div>
        <div className={controlDirectionals}>
          <div className={`${controlRow} ${controlRowCenter}`}>
            <InfraredButton color='var(--blue)' handleButtonClick={handleButtonClick} value='DDDDDD' text='⮝' />
          </div>
          <div className={controlRow}>
            <InfraredButton color='var(--blue)' handleButtonClick={handleButtonClick} value='D1D1D1' text='⮜' />
            <InfraredButton color='var(--red)' handleButtonClick={handleButtonClick} value='CCF9D8' text='OK' />
            <InfraredButton color='var(--blue)' handleButtonClick={handleButtonClick} value='D9D9D9' text='⮞' />
          </div>
          <div className={`${controlRow} ${controlRowCenter}`}>
            <InfraredButton color='var(--blue)' handleButtonClick={handleButtonClick} value='C1D9F1' text='⮟' />
          </div>
        </div>
        <div className={controlGeneratorCode}>
          <div className={controlRow}>
            <input className="generate-code" ref={inputRef} placeholder="Digite seu código..." type="text" onChange={handleInputChange} />
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

ConfigInfraredModal.propTypes = {
  handleUpdateCode: P.func,
  closeModal: P.func,
  isOpen: P.bool,
}

export default ConfigInfraredModal;
