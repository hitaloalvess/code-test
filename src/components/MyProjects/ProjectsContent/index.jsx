import { SmileyXEyes } from '@phosphor-icons/react';
import P from 'prop-types';

import * as PC from './styles.module.css';
import { SpinnerLoader } from '@/components/SharedComponents/SpinnerLoader';

const ProjectsContent = ({ isLoading, hasProjects, children }) => {


  if (isLoading) {
    return (
      <div
        className={PC.myProjectLoadContainer}
      >
        <SpinnerLoader.Root>
          <SpinnerLoader.IconText text={'Carregando projetos'} />
        </SpinnerLoader.Root>
      </div>
    )
  }

  if (!hasProjects) {
    return (
      <div className={PC.myProjectListEmpty}>
        <SmileyXEyes weight="fill" />
        <span>
          <h1>Nenhum projeto foi encontrado</h1>
          <p>Crie um projeto e comece a trabalhar com a Microdigo..</p>
        </span>
      </div>
    )
  }

  return (children)
};

ProjectsContent.propTypes = {
  isLoading: P.bool.isRequired,
  hasProjects: P.bool.isRequired,
  children: P.element.isRequired
}

export default ProjectsContent;
