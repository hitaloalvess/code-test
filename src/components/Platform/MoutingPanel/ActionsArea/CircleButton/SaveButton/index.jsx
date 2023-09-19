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

const INTERVAL_UPDATE = 1000 * 30; //30 seconds
const SaveButton = () => {
  const { id: projectId } = useParams();

  const { saveProject } = useProject();

  const [isLoading, setIsLoading] = useState(false);
  const interval = useRef(null);

  const {
    hasUpdate,
    changeHasUpdate,
  } = useStore(store => ({
    hasUpdate: store.hasUpdate,
    changeHasUpdate: store.changeHasUpdate
  }), shallow);

  useEffect(() => {

    interval.current = setInterval(async () => {
      if (!hasUpdate) return;

      setIsLoading(true);
      saveProject(projectId)
        .then(() => {
          setIsLoading(false);
          changeHasUpdate(false);
        })
        .catch(() => {
          setIsLoading(false);
          changeHasUpdate(false);
        });

    }, INTERVAL_UPDATE);

    return () => {
      clearInterval(interval.current);
    }
  }, [hasUpdate]);

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
