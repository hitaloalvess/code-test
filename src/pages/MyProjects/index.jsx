import { useMemo, useState } from 'react';
import { MagnifyingGlass, SmileyXEyes } from '@phosphor-icons/react';

import { useProject, useQueryProject } from '@/hooks/useProject';
import { useAuth } from '@/hooks/useAuth';

import { Input } from '@/components/SharedComponents/Input';
import Header from '@/components/SharedComponents/Header';
import ProjectCard from '@/components/MyProjects/ProjectCard';
import NewProjectButton from '@/components/MyProjects/NewProjectButton';
import ProjectList from '@/components/MyProjects/ProjectList';

import * as MP from './styles.module.css';

const MyProjects = () => {

  const { user } = useAuth();
  const {
    createProject,
    deleteProject,
    updateProject
  } = useProject(user.cpf);

  const [filter, setFilter] = useState('');

  const { data: projects, isLoading } = useQueryProject(user.cpf);

  const filteredProjects = useMemo(() => {

    if (!projects?.data) return [];

    if (!filter) return projects.data;

    const list = projects?.data.filter(project => {
      return project.name.toLowerCase().includes(filter.toLowerCase());
    })

    return list;
  }, [projects, filter]);

  const handleFilterProjects = (event) => setFilter(event.target.value);

  return (
    <>
      <Header />
      <main className={MP.myProjectsContainer}>
        <div className={MP.myProjectsToolbar}>
          <h1 className={MP.myProjectsTitle} >Meus projetos</h1>

          <span>
            <Input.Root>
              <>
                <Input.Icon icon={<MagnifyingGlass fontSize={20} />} />
                <Input.TextType
                  placeholder={"Procurar projetos"}
                  onChange={handleFilterProjects}
                />
              </>
            </Input.Root>

            <NewProjectButton onCreate={createProject} />
          </span>
        </div>

        {
          filteredProjects?.length > 0 || isLoading ?

            <ProjectList hasProjects={filteredProjects?.length > 0}>

              {
                filteredProjects.map(project => (
                  <ProjectCard
                    key={project.id}
                    data={{
                      id: project.id,
                      name: project.name,
                      description: project.description,
                      createdAt: project.createdAt,
                    }}
                    onDelete={deleteProject}
                    onUpdate={updateProject}
                  />
                ))
              }
            </ProjectList> :

            <div className={MP.myProjectListEmpty}>
              <SmileyXEyes weight="fill" />
              <span>
                <h1>Nenhum projeto foi encontrado</h1>
                <p>Crie um projeto e comece a trabalhar com a Microdigo..</p>
              </span>
            </div>
        }

      </main>
    </>
  );
};

export default MyProjects;
