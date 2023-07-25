import { questions } from '@/data/faq';

import { Question } from './Question';

import * as Q from './styles.module.css'

const Questions = () => {
  return (
    <div className={Q.questionList}>
      {
        questions.map((question, index) => (
          <Question.Root key={index}>
            <Question.Header
              title={question.title}
            />
            <Question.Content>
              <Question.Text
                text={question.description}
              />
              <Question.Video
                url={question.url}
                width={'100%'}
                height={'400px'}
                allowFullScreen={true}
              />
            </Question.Content>
          </Question.Root>
        ))
      }
    </div>
  );
};

export default Questions;
