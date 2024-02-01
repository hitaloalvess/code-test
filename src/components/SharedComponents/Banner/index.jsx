import BannerImg from '@/assets/images/banner.webp';
import DeviceImageLDR from '@/assets/images/devices/entry/photoresist.svg';
import DeviceImagePotentiometer from '@/assets/images/devices/entry/potentiometer.svg';
import DeviceImageLED from '@/assets/images/devices/exit/led.svg';
import { DeviceCard } from './DeviceCard';

import * as B from './styles.module.css';

const Banner = () => {
  return (
    <section className={B.container}>

      <div className={B.hero}>
        <img src={BannerImg} alt="Imagem da plataforma microdigo" />
      </div>

      <div className={B.content}>
        <DeviceCard.Root color='red'>
          <DeviceCard.Image imgSrc={DeviceImageLED} />
        </DeviceCard.Root>

        <DeviceCard.Root color='yellow'>
          <DeviceCard.Image imgSrc={DeviceImagePotentiometer} />
        </DeviceCard.Root>

        <DeviceCard.Root color='blue'>
          <DeviceCard.Image imgSrc={DeviceImageLDR} />
        </DeviceCard.Root>
      </div>
    </section>
  );
};

export default Banner;
