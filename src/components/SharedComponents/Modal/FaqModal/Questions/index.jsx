import { BookOpen } from '@phosphor-icons/react';

import { questions } from '@/data/faq';

import { Question } from './Question';

import * as Q from './styles.module.css'

const Questions = () => {
  return (
    <div className={Q.questionList}>
      {
        questions.map(question => (
          <Question.Root
            key={question.id}
            data-category={question.category}
          >
            <Question.Header
              title={question.title}
            />
            <Question.Content>
              <Question.Text
                text={question.response}
              />

              <Question.Link
                url={`${import.meta.env.VITE_MANUAL_URL}/${question.anchorManual}`}
                target='_blank'
              >
                <p>Acessar manual para mais informações</p>
                <BookOpen />
              </Question.Link>
            </Question.Content>
          </Question.Root>
        ))
      }
    </div>
  );
};

export default Questions;
