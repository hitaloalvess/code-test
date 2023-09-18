import { useRef, useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import P from 'prop-types';

import { useAuth } from '@/hooks/useAuth';
import { Form } from '@/components/SharedComponents/Form';
import { Input } from '@/components/SharedComponents/Input';

import * as UP from './styles.module.css';

const createProjectSchema = z.object({
  name: z.string().nonempty().trim().max(50, 'Limite máximo de 50 caracteres para o nome do projeto.'),
  description: z.string().nonempty().trim().max(120, 'Limite máximo de 120 caracteres para a descrição do projeto.'),
});


const CreateProjectModal = ({
  contentData, closeModal
}) => {
  const { title, project, handleConfirm } = contentData;

  const { user } = useAuth();

  const isFirstRender = useRef(true);
  const [hasCompletedFields, setHasCompletedFields] = useState(true);

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch
  } = useForm({
    resolver: zodResolver(createProjectSchema),
    shouldFocusError: false
  });

  const handleSubmitForm = async (formData) => {

    const { name, description } = formData;

    try {

      const newProject = {
        id: project ? project.id : null,
        name,
        user: {
          email: user.email,
          name: user.name,
          cpf: user.cpf
        },
        description,
        devices: [],
        flows: []
      }
      handleConfirm(newProject);

      closeModal();


    } catch (error) {
      (error);
    }

  }


  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const name = !!watch('name');
    const description = !!watch('description');

    setHasCompletedFields(name && description ? false : true)

  }, [watch('name'), watch('description')])


  return (

    <section
      className={UP.content}
    >

      <header
        className={UP.header}
      >

        <h1
        >
          {title}
        </h1>
      </header>

      <Form.Root onSubmit={handleSubmit(handleSubmitForm)}>

        <Form.Content>

          <Form.Row >

            <Input.Root
              error={errors.name}
            >
              <Input.TextType
                placeholder={"Digite o nome do projeto"}
                hasIconSibling={false}
                defaultValue={project?.name || ''}
                {...register('name')}
              />
            </Input.Root>

          </Form.Row>

          <Form.Row >

            <Input.Root
              error={errors.description}
            >
              <Input.TextType
                placeholder={"Digite a descrição do projeto"}
                hasIconSibling={false}
                defaultValue={project?.description || ''}
                {...register('description')}
              />
            </Input.Root>

          </Form.Row>

          <Form.ButtonSubmit disabled={hasCompletedFields}>
            <p>{project ? 'Atualizar' : 'Criar'}</p>
          </Form.ButtonSubmit>

        </Form.Content>

      </Form.Root>
    </section>
  );
};

CreateProjectModal.propTypes = {
  closeModal: P.func.isRequired,
  contentData: P.shape({
    title: P.string.isRequired,
    handleConfirm: P.func,
    project: P.shape({
      id: P.string.isRequired,
      name: P.string.isRequired,
      description: P.string.isRequired,
    })
  }).isRequired
}

export default CreateProjectModal;
