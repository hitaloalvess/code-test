import BannerImg from '@/assets/images/banner.webp';
import DeviceImageLDR from '@/assets/images/devices/entry/ldr.svg';
import DeviceImagePotentiometer from '@/assets/images/devices/entry/potentiometer.svg';
import DeviceImageLED from '@/assets/images/devices/exit/led.svg';

import { DeviceCard } from './DeviceCard';

const Banner = () => {
  return (
    <section className='flex justify-end items-center bg-white-100'>

      <div className='fixed w-[380px]'>
        <img src={BannerImg} alt="Imagem da plataforma microdigo" />
      </div>

      <div className="relative w-full h-full">
        <DeviceCard.Root
          className="top-[60px] right-[48px] bg-red"
        >
          <DeviceCard.Image imgSrc={DeviceImageLED} />
        </DeviceCard.Root>

        <DeviceCard.Root
          className="top-[40px] left-[82px] bg-yellow"
        >
          <DeviceCard.Image imgSrc={DeviceImagePotentiometer} />
        </DeviceCard.Root>

        <DeviceCard.Root
          className="bottom-14 right-[135px] bg-blue"
        >
          <DeviceCard.Image imgSrc={DeviceImageLDR} />
        </DeviceCard.Root>
      </div>
    </section>
  );
};

export default Banner;
