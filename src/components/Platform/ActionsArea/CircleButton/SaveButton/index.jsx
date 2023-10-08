import { useEffect, useRef, useState } from "react";
import { CloudCheck } from "@phosphor-icons/react";
import { useParams } from "react-router-dom";
import { shallow } from 'zustand/shallow';

import { useStore } from '@/store';
import { useProject } from '@/hooks/useProject';

import { SpinnerLoader } from '@/components/SharedComponents/SpinnerLoader';
import CircleButton from "..";
import imgCircleBase from '@/assets/images/buttons/circle-button-base.svg';


import * as SB from './styles.module.css';

const INTERVAL_UPDATE = 1000 * 10; //10 seconds
const SaveButton = () => {
  const { id } = useParams();

  const { saveProject } = useProject();

  const [isLoading, setIsLoading] = useState(false);
  const interval = useRef(null);

  const {
    hasProjectUpdate,
    changeHasProjectUpdate,
  } = useStore(store => ({
    hasProjectUpdate: store.hasProjectUpdate,
    changeHasProjectUpdate: store.changeHasProjectUpdate
  }), shallow);


  const handleSave = async () => {
    if (!hasProjectUpdate) return;


    try {
      setIsLoading(true);
      await saveProject({ id });

      setIsLoading(false);
      changeHasProjectUpdate(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      changeHasProjectUpdate(false);
    }

  }

  useEffect(() => {

    interval.current = setInterval(() => handleSave().catch(err => console.log(err)), INTERVAL_UPDATE);

    return () => {
      clearInterval(interval.current);
    }
  }, [hasProjectUpdate]);



  return (

    <CircleButton
      imgSrc={imgCircleBase}
      name={'save-button'}
      alt='Imagem do botão de salvamento automatico'
      title='Botão de salvamento automático'
      handleClick={() => handleSave().catch(err => console.log(err))
      }
    >
      {
        isLoading ?
          <div className={SB.saveBtnSpinner}>
            <SpinnerLoader.Icon />
          </div> :
          <CloudCheck className={SB.saveBtnIcon} />
      }
    </CircleButton>
  );
};

export default SaveButton;
