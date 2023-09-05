import { useEffect, useState } from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';

import { useProject } from '@/hooks/useProject';

import { Input } from '@/components/SharedComponents/Input';
import Header from '@/components/SharedComponents/Header';
import ProjectCard from '@/components/MyProjects/ProjectCard';
import NewProjectButton from '@/components/MyProjects/NewProjectButton';

import * as MP from './styles.module.css';

const MyProjects = () => {
  const { getProjects, deleteProject, updateProject, createProject } = useProject();

  const [projects, setProjects] = useState([]);


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
                  className={MP.test}
                />
              </>
            </Input.Root>

            <NewProjectButton onCreate={handleProjectCreate} />
          </span>
        </div>

        {
          projects.length <= 0 ?
            <h1>Você ainda não possui projetos criados.</h1> :
            <ul className={MP.myProjectsList}>
              {projects.map(project => (
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
              ))}
            </ul>
        }

      </main>
    </>
  );
};

export default MyProjects;
