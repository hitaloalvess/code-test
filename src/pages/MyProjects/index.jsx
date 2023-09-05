import { useEffect, useMemo, useState } from 'react';
import { MagnifyingGlass, SmileyXEyes } from '@phosphor-icons/react';

import { useProject } from '@/hooks/useProject';

import { Input } from '@/components/SharedComponents/Input';
import Header from '@/components/SharedComponents/Header';
import ProjectCard from '@/components/MyProjects/ProjectCard';
import NewProjectButton from '@/components/MyProjects/NewProjectButton';

import * as MP from './styles.module.css';
import ProjectList from '../../components/MyProjects/ProjectList';

const MyProjects = () => {
  const { getProjects, deleteProject, updateProject, createProject } = useProject();

  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('');


  const filteredProjects = useMemo(() => {
    if (!filter) return projects;

    const list = projects.filter(project => {
      return project.name.toLowerCase().includes(filter.toLowerCase());
    })

    return list;
  }, [projects, filter]);

  const handleProjectDelete = (projectId) => {
    deleteProject(projectId);

    setProjects(prevProjects => {
      const newProjects = prevProjects.filter(project => project.id !== projectId);

      return newProjects;
    })

  }

  const handleProjectUpdate = (newProject) => {
    updateProject(newProject);

    setProjects(prevProjects => {

      const newProjects = prevProjects.map(project => {

        if (project.id === newProject.id) {

          return {
            ...project,
            name: newProject.name,
            description: newProject.description
          }
        }

        return project;
      });

      return newProjects;
    })
  }

  const handleProjectCreate = (newProject) => {
    const projectId = createProject(newProject);

    setProjects(prevProjects => [...prevProjects, newProject]);

    return projectId;
  }

  const handleFilterProjects = (event) => setFilter(event.target.value);


  useEffect(() => {
    const projects = getProjects();
    setProjects(projects)
  }, []);

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

            <NewProjectButton onCreate={handleProjectCreate} />
          </span>
        </div>

        {
          filteredProjects.length > 0 ?
            <ProjectList hasProjects={filteredProjects.length > 0}>

              {
                filteredProjects.map(project => (
                  <ProjectCard
                    key={project.id}
                    data={{
                      id: project.id,
                      name: project.name,
                      description: project.description,
                      created_at: project.created_at,
                    }}
                    onDelete={handleProjectDelete}
                    onUpdate={handleProjectUpdate}
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
