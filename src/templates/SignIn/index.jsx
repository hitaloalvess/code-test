import Banner from '@/components/Banner';

import { container, content } from './styles.module.css';

const SignIn = () => {
  return (
    <div className={container}>
      <div className={content}>
        Content
      </div>

      <Banner />
    </div>
  );
};

export default SignIn;
