import { useMemo, useState } from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';

import { useProject, useQueryProject } from '@/hooks/useProject';
import { useContextAuth } from '@/hooks/useAuth';

import { Input } from '@/components/SharedComponents/Input';
import Header from '@/components/SharedComponents/Header';
import ProjectCard from '@/components/MyProjects/ProjectCard';
import NewProjectButton from '@/components/MyProjects/NewProjectButton';
import ProjectList from '@/components/MyProjects/ProjectList';

import * as MP from './styles.module.css';
import ProjectsContent from '../../components/MyProjects/ProjectsContent';

const MyProjects = () => {
  const { person } = useContextAuth();
  const {
    createProject,
    deleteProject,
    updateProject
  } = useProject(person.id);

  const [filter, setFilter] = useState('');

  const { data: projects, isLoading } = useQueryProject(person.id);

  const filteredProjects = useMemo(() => {

    if (!projects) return [];

    if (!filter) return projects;

    const list = projects.filter(project => {
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

        <ProjectsContent
          isLoading={isLoading}
          hasProjects={filteredProjects?.length > 0}
        >
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
          </ProjectList>
        </ProjectsContent>
      </main>
    </>
  );
};

export default MyProjects;
