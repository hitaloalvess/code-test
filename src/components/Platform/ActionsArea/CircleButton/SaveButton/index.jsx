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

  useEffect(() => {

    interval.current = setInterval(async () => {
      if (!hasProjectUpdate) return;


      try{
        setIsLoading(true);
        await saveProject({ id });

        setIsLoading(false);
        changeHasProjectUpdate(false);
      }catch(error){
        console.log(error);
        setIsLoading(false);
        changeHasProjectUpdate(false);
      }

    }, INTERVAL_UPDATE);

    return () => {
      clearInterval(interval.current);
    }
  }, [hasProjectUpdate]);

  return (
    <div
      className={SB.saveButtonContainer}
      title='Botão de salvamento automático'
    >
      {
        isLoading ?
          <div className={SB.saveBtnSpinner}>
            <SpinnerLoader.Icon />
          </div> :
          <CloudCheck className={SB.saveBtnIcon} />
      }

      <CircleButton
        imgSrc={imgCircleBase}
        name={'save-button'}
        alt='Imagem do botão de salvamento automatico'
      />
    </div>
  );
};

export default SaveButton;
